import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  Bug,
  Leaf,
  MapPin,
  TrendingUp,
  Filter,
} from "lucide-react";
import { SAMPLE_DETECTIONS } from "../data/detectionData";
import "../styles/Heatmap.css";

const Heatmap = () => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [filter, setFilter] = useState("ALL");
  const [detections, setDetections] = useState(SAMPLE_DETECTIONS);
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  // Fetch real logs from Python backend
  const fetchLogs = useCallback(async () => {
    try {
      const host = window.location.hostname || "localhost";
      const res = await fetch(`http://${host}:8000/api/logs`);
      if (res.ok) {
        const data = await res.json();
        if (data.logs && data.logs.length > 0) {
          setDetections(data.logs);
          setIsLiveSynced(true);
        }
      }
    } catch (e) {
      setIsLiveSynced(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 4000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  const filteredData = useMemo(() => {
    if (filter === "ALL") return detections;
    return detections.filter((d) => d.type === filter);
  }, [filter, detections]);

  // Compute summary stats
  const stats = useMemo(() => {
    const diseases = detections.filter((d) => d.type === "DISEASE").length;
    const pests = detections.filter((d) => d.type === "PEST").length;
    const total = detections.length;

    const lats = detections.map((d) => d.latitude);
    const lngs = detections.map((d) => d.longitude);
    const latRange = Math.max(...lats) - Math.min(...lats);
    const lngRange = Math.max(...lngs) - Math.min(...lngs);
    // At ~26°N: 1° lat ≈ 111km, 1° lng ≈ 100km
    const area = latRange * 111 * (lngRange * 100);

    return { diseases, pests, total, area: area.toFixed(3) };
  }, [detections]);

  // Compute breakdown by threat name
  const breakdown = useMemo(() => {
    const map = {};
    filteredData.forEach((d) => {
      if (!map[d.name]) {
        map[d.name] = { name: d.name, type: d.type, count: 0, totalConf: 0 };
      }
      map[d.name].count++;
      map[d.name].totalConf += d.confidence;
    });
    return Object.values(map)
      .map((b) => ({
        ...b,
        avgConf: (b.totalConf / b.count).toFixed(2),
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  // Draw heatmap on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || filteredData.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const dw = rect.width;
    const dh = rect.height;

    // Background
    ctx.fillStyle = "#f0f5f0";
    ctx.fillRect(0, 0, dw, dh);

    // Determine geographic bounds
    const lats = filteredData.map((d) => d.latitude);
    const lngs = filteredData.map((d) => d.longitude);
    const padding = 0.0003;
    const minLat = Math.min(...lats) - padding;
    const maxLat = Math.max(...lats) + padding;
    const minLng = Math.min(...lngs) - padding;
    const maxLng = Math.max(...lngs) + padding;
    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;

    // Create heatmap grid
    const gridCols = 35;
    const gridRows = Math.max(10, Math.round((dh / dw) * gridCols));
    const grid = Array.from({ length: gridRows }, () =>
      Array(gridCols).fill(0),
    );
    const cellW = dw / gridCols;
    const cellH = dh / gridRows;

    // Populate grid with detection density
    filteredData.forEach((d) => {
      const col = Math.min(
        gridCols - 1,
        Math.floor(((d.longitude - minLng) / lngRange) * gridCols),
      );
      const row = Math.min(
        gridRows - 1,
        Math.floor(((d.latitude - minLat) / latRange) * gridRows),
      );
      grid[row][col] += 1;

      // Gaussian-like spread to neighbors for smoother heatmap
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = row + dr;
          const nc = col + dc;
          if (nr >= 0 && nr < gridRows && nc >= 0 && nc < gridCols) {
            const dist = Math.sqrt(dr * dr + dc * dc);
            grid[nr][nc] += Math.max(0, 0.5 - dist * 0.15);
          }
        }
      }
    });

    const maxVal = Math.max(...grid.flat(), 1);

    // Color interpolation function
    const getColor = (val) => {
      const norm = val / maxVal;
      if (norm === 0) return "rgba(200, 235, 200, 0.5)";
      if (norm < 0.15) return `rgba(129, 199, 132, ${0.4 + norm * 2})`;
      if (norm < 0.35) return `rgba(255, 213, 79, ${0.5 + norm})`;
      if (norm < 0.6) return `rgba(255, 152, 0, ${0.6 + norm * 0.4})`;
      return `rgba(229, 57, 53, ${0.7 + norm * 0.3})`;
    };

    // Draw grid cells
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const x = c * cellW;
        const y = (gridRows - 1 - r) * cellH; // flip: north at top
        ctx.fillStyle = getColor(grid[r][c]);
        ctx.fillRect(x + 0.5, y + 0.5, cellW - 1, cellH - 1);
      }
    }

    // Draw grid lines (subtle)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= gridCols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellW, 0);
      ctx.lineTo(c * cellW, dh);
      ctx.stroke();
    }
    for (let r = 0; r <= gridRows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellH);
      ctx.lineTo(dw, r * cellH);
      ctx.stroke();
    }

    // Draw detection points
    filteredData.forEach((d) => {
      const px = ((d.longitude - minLng) / lngRange) * dw;
      const py = (1 - (d.latitude - minLat) / latRange) * dh;

      // Outer glow
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle =
        d.type === "DISEASE"
          ? "rgba(211, 47, 47, 0.25)"
          : "rgba(25, 118, 210, 0.25)";
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fillStyle =
        d.type === "DISEASE"
          ? "rgba(211, 47, 47, 0.9)"
          : "rgba(25, 118, 210, 0.9)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    // Border
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, dw, dh);

    // Axis labels
    ctx.fillStyle = "#888";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`${minLat.toFixed(4)}°N`, 5, dh - 5);
    ctx.textAlign = "right";
    ctx.fillText(`${maxLat.toFixed(4)}°N`, dw - 5, 14);
    ctx.textAlign = "left";
    ctx.fillText(`${minLng.toFixed(4)}°E`, 5, dh - 18);
    ctx.textAlign = "right";
    ctx.fillText(`${maxLng.toFixed(4)}°E`, dw - 5, dh - 5);

    // Title overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(0, 0, dw, 30);
    ctx.fillStyle = "white";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    ctx.fillText("FARMHAWK — FIELD THREAT DENSITY MAP", dw / 2, 19);
  }, [filteredData]);

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <div className="heatmap-header-content">
          <div>
            <h1>
              <MapPin size={28} className="heatmap-header-icon" />
              {t("heatmap")}
            </h1>
            <p>{t("heatmap_subtitle")}</p>
          </div>
          <div className={`live-sync-badge ${isLiveSynced ? "synced" : "offline"}`}>
            <span className="status-dot" />
            <span>{isLiveSynced ? "🟢 Live AI Server Synced" : "🟡 Offline Snapshot Data"}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="heatmap-stats">
        <div className="heatmap-stat-card">
          <div className="heatmap-stat-icon icon-total">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="heatmap-stat-label">{t("total_detections")}</p>
            <h3>{stats.total}</h3>
          </div>
        </div>
        <div className="heatmap-stat-card">
          <div className="heatmap-stat-icon icon-disease">
            <Leaf size={24} />
          </div>
          <div>
            <p className="heatmap-stat-label">{t("diseases_found")}</p>
            <h3>{stats.diseases}</h3>
          </div>
        </div>
        <div className="heatmap-stat-card">
          <div className="heatmap-stat-icon icon-pest">
            <Bug size={24} />
          </div>
          <div>
            <p className="heatmap-stat-label">{t("pests_found")}</p>
            <h3>{stats.pests}</h3>
          </div>
        </div>
        <div className="heatmap-stat-card">
          <div className="heatmap-stat-icon icon-area">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="heatmap-stat-label">{t("affected_area")}</p>
            <h3>{stats.area} km²</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="heatmap-filter">
        <Filter size={18} className="filter-icon" />
        <button
          className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
          onClick={() => setFilter("ALL")}
        >
          All ({stats.total})
        </button>
        <button
          className={`filter-btn filter-disease ${filter === "DISEASE" ? "active" : ""}`}
          onClick={() => setFilter("DISEASE")}
        >
          🍂 {t("diseases_found")} ({stats.diseases})
        </button>
        <button
          className={`filter-btn filter-pest ${filter === "PEST" ? "active" : ""}`}
          onClick={() => setFilter("PEST")}
        >
          🐛 {t("pests_found")} ({stats.pests})
        </button>
      </div>

      {/* Heatmap Canvas */}
      <div className="heatmap-canvas-wrapper">
        <canvas ref={canvasRef} className="heatmap-canvas" />

        {/* Legend */}
        <div className="heatmap-legend">
          <span className="legend-title">{t("severity_legend")}</span>
          <div className="legend-scale">
            <div className="legend-item">
              <span className="legend-color safe" />
              <span>{t("safe")}</span>
            </div>
            <div className="legend-item">
              <span className="legend-color low" />
              <span>{t("low_severity")}</span>
            </div>
            <div className="legend-item">
              <span className="legend-color medium" />
              <span>{t("medium_severity")}</span>
            </div>
            <div className="legend-item">
              <span className="legend-color high" />
              <span>{t("high_severity")}</span>
            </div>
          </div>
          <div className="legend-markers">
            <div className="legend-marker">
              <span className="marker-dot marker-disease" />{" "}
              {t("diseases_found")}
            </div>
            <div className="legend-marker">
              <span className="marker-dot marker-pest" /> {t("pests_found")}
            </div>
          </div>
        </div>
      </div>

      {/* Detection Breakdown Table */}
      <div className="breakdown-section">
        <h2>{t("detection_breakdown")}</h2>
        <div className="breakdown-table-wrapper">
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>{t("threat_name")}</th>
                <th>{t("type")}</th>
                <th>{t("count")}</th>
                <th>{t("avg_confidence")}</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item) => (
                <tr key={item.name}>
                  <td className="name-cell">
                    {item.type === "DISEASE" ? "🍂" : "🐛"}{" "}
                    {item.name.replace(/_/g, " ")}
                  </td>
                  <td>
                    <span
                      className={`type-badge ${item.type.toLowerCase()}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="count-cell">{item.count}</td>
                  <td className="conf-cell">{item.avgConf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
