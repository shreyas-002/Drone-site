import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Video,
  VideoOff,
  Eye,
  EyeOff,
  Radio,
  Leaf,
  Bug,
  Zap,
  AlertTriangle,
  Camera,
  RefreshCw,
  Smartphone,
  Wifi,
  Info,
} from "lucide-react";
import {
  DISEASE_NAMES,
  PEST_NAMES,
  generateSimulatedDetection,
} from "../data/detectionData";
import "../styles/LiveFeed.css";

const LiveFeed = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const telemetryRef = useRef({
    lat: 26.827,
    lng: 75.565,
    altitude: 50,
    battery: 94,
    speed: 12,
  });
  const detectionsRef = useRef([]);
  const showDetectionsRef = useRef(true);
  const cameraErrorRef = useRef(false);
  const frameCountRef = useRef(0);

  const [isStreaming, setIsStreaming] = useState(false);
  const [showDetections, setShowDetections] = useState(true);
  const [cameraError, setCameraError] = useState(false);
  const [detectionLog, setDetectionLog] = useState([]);
  const [stats, setStats] = useState({ diseases: 0, pests: 0, total: 0 });
  const [telemetryDisplay, setTelemetryDisplay] = useState(telemetryRef.current);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [isRefreshingDevices, setIsRefreshingDevices] = useState(false);
  const [showPhoneGuide, setShowPhoneGuide] = useState(true);
  const [isServerConnected, setIsServerConnected] = useState(false);

  const wsRef = useRef(null);
  const frameSenderIntervalRef = useRef(null);

  const refreshCameras = useCallback(async (autoTrigger = false) => {
    setIsRefreshingDevices(true);
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;

      // Requesting a quick probe forces macOS to wake up wireless continuity cameras
      if (!autoTrigger) {
        try {
          const probeStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          probeStream.getTracks().forEach((track) => track.stop());
        } catch (e) {
          console.warn("Probe stream error:", e);
        }
      }

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
      setDevices(videoDevices);

      const iPhoneDevice = videoDevices.find((d) =>
        d.label.toLowerCase().includes("iphone")
      );
      if (iPhoneDevice) {
        setSelectedDeviceId(iPhoneDevice.deviceId);
      } else if (videoDevices.length > 0) {
        setSelectedDeviceId((prev) => prev || videoDevices[0].deviceId);
      }
    } catch (e) {
      console.warn("Error refreshing devices:", e);
    } finally {
      setIsRefreshingDevices(false);
    }
  }, []);

  // Enumerate video devices on mount
  useEffect(() => {
    refreshCameras(true);
    const onDeviceChange = () => refreshCameras(true);
    navigator.mediaDevices?.addEventListener?.("devicechange", onDeviceChange);
    return () => {
      navigator.mediaDevices?.removeEventListener?.("devicechange", onDeviceChange);
    };
  }, [refreshCameras]);

  // Keep refs in sync with state
  useEffect(() => {
    showDetectionsRef.current = showDetections;
  }, [showDetections]);

  useEffect(() => {
    cameraErrorRef.current = cameraError;
  }, [cameraError]);

  const drawSimulatedBackground = useCallback((ctx, w, h) => {
    ctx.fillStyle = "#0a1a0a";
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = "rgba(45, 127, 62, 0.12)";
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Scanning line
    const scanY = ((Date.now() % 4000) / 4000) * h;
    const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
    gradient.addColorStop(0, "rgba(76, 175, 80, 0)");
    gradient.addColorStop(0.5, "rgba(76, 175, 80, 0.25)");
    gradient.addColorStop(1, "rgba(76, 175, 80, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, scanY - 30, w, 60);

    ctx.fillStyle = "rgba(76, 175, 80, 0.4)";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("SIMULATED DRONE CAMERA FEED", w / 2, h / 2 - 10);
    ctx.fillText("Camera access not available", w / 2, h / 2 + 15);
  }, []);

  const drawDetections = useCallback((ctx, w, h) => {
    const now = Date.now();
    const dets = detectionsRef.current;

    dets.forEach((det) => {
      const elapsed = now - det.createdAt;
      if (elapsed > det.ttl) return;

      const alpha = Math.min(1, 1 - (elapsed / det.ttl) * 0.5);
      const x = (det.box.x / 100) * w;
      const y = (det.box.y / 100) * h;
      const bw = (det.box.w / 100) * w;
      const bh = (det.box.h / 100) * h;

      const isDisease = det.type === "DISEASE";
      const color = isDisease
        ? `rgba(255, 60, 60, ${alpha})`
        : `rgba(60, 120, 255, ${alpha})`;
      const bgColor = isDisease
        ? `rgba(200, 30, 30, ${alpha * 0.85})`
        : `rgba(30, 80, 200, ${alpha * 0.85})`;

      // Box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(x, y, bw, bh);

      // Corner accents
      const cLen = Math.min(14, bw * 0.2, bh * 0.2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;

      ctx.beginPath();
      ctx.moveTo(x, y + cLen);
      ctx.lineTo(x, y);
      ctx.lineTo(x + cLen, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + bw - cLen, y);
      ctx.lineTo(x + bw, y);
      ctx.lineTo(x + bw, y + cLen);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y + bh - cLen);
      ctx.lineTo(x, y + bh);
      ctx.lineTo(x + cLen, y + bh);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + bw - cLen, y + bh);
      ctx.lineTo(x + bw, y + bh);
      ctx.lineTo(x + bw, y + bh - cLen);
      ctx.stroke();

      // Label
      const prefix = isDisease ? "DISEASE" : "PEST";
      const label = `${prefix}: ${det.name.replace(/_/g, " ")} (${det.confidence})`;
      ctx.font = "bold 11px monospace";
      const tw = ctx.measureText(label).width;
      ctx.fillStyle = bgColor;
      const lx = x;
      const ly = y - 22;
      ctx.fillRect(lx, ly, tw + 14, 20);
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.fillText(label, lx + 7, ly + 14);
    });
  }, []);

  const drawHUD = useCallback((ctx, w, h) => {
    const tel = telemetryRef.current;

    // Top-left: LIVE indicator
    const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 500);
    ctx.fillStyle = `rgba(255, 0, 0, ${pulse})`;
    ctx.beginPath();
    ctx.arc(22, 22, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "left";
    ctx.fillText("LIVE", 34, 27);

    ctx.font = "11px monospace";
    ctx.fillStyle = `rgba(255, 80, 80, ${pulse})`;
    ctx.fillText("● REC", 78, 27);

    // Top-right: timestamp
    const timeStr = new Date().toLocaleTimeString("en-IN", { hour12: false });
    const dateStr = new Date().toLocaleDateString("en-IN");
    ctx.font = "11px monospace";
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillText(`${dateStr}  ${timeStr}`, w - 12, 22);
    ctx.fillText("FarmHawk v2.0  |  YOLOv8 Active", w - 12, 38);

    // Bottom bar background
    ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    ctx.fillRect(0, h - 34, w, 34);

    // Bottom-left: GPS
    ctx.fillStyle = "rgba(76, 175, 80, 0.95)";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText(
      `📍 ${tel.lat.toFixed(6)}°N  ${tel.lng.toFixed(6)}°E`,
      12,
      h - 13,
    );

    // Bottom-right: telemetry
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "11px monospace";
    ctx.textAlign = "right";
    ctx.fillText(
      `ALT: ${tel.altitude.toFixed(0)}m  |  BAT: ${tel.battery.toFixed(0)}%  |  SPD: ${tel.speed.toFixed(1)} km/h`,
      w - 12,
      h - 13,
    );

    // Center crosshair
    ctx.strokeStyle = "rgba(76, 175, 80, 0.25)";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    const cx = w / 2;
    const cy = h / 2;
    const gap = 8;
    const arm = 20;

    ctx.beginPath();
    ctx.moveTo(cx - arm, cy);
    ctx.lineTo(cx - gap, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + gap, cy);
    ctx.lineTo(cx + arm, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - arm);
    ctx.lineTo(cx, cy - gap);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy + gap);
    ctx.lineTo(cx, cy + arm);
    ctx.stroke();
  }, []);

  const startCanvasLoop = useCallback(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (cameraErrorRef.current || !streamRef.current) {
        drawSimulatedBackground(ctx, canvas.width, canvas.height);
      }

      if (showDetectionsRef.current) {
        drawDetections(ctx, canvas.width, canvas.height);
      }

      drawHUD(ctx, canvas.width, canvas.height);

      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
  }, [drawSimulatedBackground, drawDetections, drawHUD]);

  // Check backend health on mount and periodically
  useEffect(() => {
    const checkServer = async () => {
      try {
        const host = window.location.hostname || "localhost";
        const res = await fetch(`http://${host}:8000/api/health`);
        if (res.ok) {
          setIsServerConnected(true);
        } else {
          setIsServerConnected(false);
        }
      } catch (e) {
        setIsServerConnected(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 4000);
    return () => clearInterval(interval);
  }, []);

  // Connect to Python FastAPI WebSocket Server
  const connectWebSocket = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const host = window.location.hostname || "localhost";
    const wsUrl = `ws://${host}:8000/ws/detect`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("🟢 WebSocket Connected to Real FarmHawk YOLOv8 Backend");
        setIsServerConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status === "success" && Array.isArray(data.detections)) {
            const now = Date.now();
            const realDets = data.detections.map((d) => ({
              ...d,
              createdAt: now,
              ttl: 1500,
            }));

            // ONLY show real detections returned by the PyTorch model
            detectionsRef.current = realDets;

            if (realDets.length > 0) {
              setDetectionLog((prev) => {
                const newItems = realDets.filter(
                  (rd) => !prev.slice(0, 5).some((p) => p.name === rd.name && Math.abs(p.createdAt - rd.createdAt) < 1200)
                );
                return [...newItems, ...prev].slice(0, 50);
              });

              const disCount = realDets.filter((d) => d.type === "DISEASE").length;
              const pestCount = realDets.filter((d) => d.type === "PEST").length;
              setStats((prev) => ({
                diseases: prev.diseases + disCount,
                pests: prev.pests + pestCount,
                total: prev.total + realDets.length,
              }));
            }
          }
        } catch (e) {
          console.warn("WS message parse error:", e);
        }
      };

      ws.onclose = () => {
        console.log("🟡 Disconnected from AI Backend");
      };

      ws.onerror = (err) => {
        console.warn("WS error:", err);
      };
    } catch (e) {
      console.warn("Could not initiate WebSocket:", e);
    }
  }, []);

  // Frame sender loop: captures video frames and sends to backend via WebSocket or HTTP POST
  const isSendingFrameRef = useRef(false);
  const startFrameSender = useCallback(() => {
    if (frameSenderIntervalRef.current) clearInterval(frameSenderIntervalRef.current);

    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = 640;
    offscreenCanvas.height = 360;
    const offscreenCtx = offscreenCanvas.getContext("2d");

    frameSenderIntervalRef.current = setInterval(async () => {
      if (
        !isSendingFrameRef.current &&
        videoRef.current &&
        videoRef.current.readyState >= 2
      ) {
        isSendingFrameRef.current = true;
        try {
          offscreenCtx.drawImage(videoRef.current, 0, 0, 640, 360);
          const base64Data = offscreenCanvas.toDataURL("image/jpeg", 0.65);
          const payload = {
            image: base64Data,
            lat: telemetryRef.current.lat,
            lng: telemetryRef.current.lng,
          };

          // 1. Try WebSocket if connected
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(payload));
          } else {
            // 2. HTTP POST fallback to real YOLO backend
            const host = window.location.hostname || "localhost";
            const res = await fetch(`http://${host}:8000/api/predict`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (res.ok) {
              const data = await res.json();
              setIsServerConnected(true);
              if (data.status === "success" && Array.isArray(data.detections)) {
                const now = Date.now();
                const realDets = data.detections.map((d) => ({
                  ...d,
                  createdAt: now,
                  ttl: 1500,
                }));
                detectionsRef.current = realDets;

                if (realDets.length > 0) {
                  setDetectionLog((prev) => {
                    const newItems = realDets.filter(
                      (rd) => !prev.slice(0, 5).some((p) => p.name === rd.name && Math.abs(p.createdAt - rd.createdAt) < 1200)
                    );
                    return [...newItems, ...prev].slice(0, 50);
                  });

                  const disCount = realDets.filter((d) => d.type === "DISEASE").length;
                  const pestCount = realDets.filter((d) => d.type === "PEST").length;
                  setStats((prev) => ({
                    diseases: prev.diseases + disCount,
                    pests: prev.pests + pestCount,
                    total: prev.total + realDets.length,
                  }));
                }
              }
            }
          }
        } catch (e) {
          // Connection error
        } finally {
          isSendingFrameRef.current = false;
        }
      }
    }, 150); // ~7-8 FPS
  }, []);

  // Telemetry drift simulator
  useEffect(() => {
    const telInterval = setInterval(() => {
      if (isStreaming) {
        telemetryRef.current = {
          lat: telemetryRef.current.lat + 0.000002,
          lng: telemetryRef.current.lng + 0.000002,
          battery: Math.max(12, telemetryRef.current.battery - 0.04),
          altitude: 45 + Math.random() * 8,
          speed: 8 + Math.random() * 6,
        };
        setTelemetryDisplay({ ...telemetryRef.current });
      }
    }, 1500);
    return () => clearInterval(telInterval);
  }, [isStreaming]);

  const startCamera = async (overrideDeviceId) => {
    const targetDeviceId = overrideDeviceId !== undefined ? overrideDeviceId : selectedDeviceId;
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      const videoConstraints = targetDeviceId
        ? { deviceId: { exact: targetDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
        : { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } };

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsStreaming(true);
      setCameraError(false);
      cameraErrorRef.current = false;

      // Re-enumerate to get updated device labels
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter((d) => d.kind === "videoinput");
        setDevices(videoDevices);
      } catch (e) {
        console.warn("Could not refresh devices:", e);
      }

      // Connect to Python AI server
      connectWebSocket();
      startFrameSender();
      startCanvasLoop();
    } catch (err) {
      console.warn("Camera access error:", err);

      // Attempt fallback
      if (targetDeviceId) {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
          streamRef.current = fallbackStream;
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            await videoRef.current.play();
          }
          setIsStreaming(true);
          setCameraError(false);
          cameraErrorRef.current = false;
          connectWebSocket();
          startFrameSender();
          startCanvasLoop();
          return;
        } catch (fallbackErr) {
          console.warn("Fallback camera failed:", fallbackErr);
        }
      }

      setCameraError(true);
      cameraErrorRef.current = true;
      setIsStreaming(true);
      connectWebSocket();
      startCanvasLoop();
    }
  };

  const handleDeviceChange = (e) => {
    const newDeviceId = e.target.value;
    setSelectedDeviceId(newDeviceId);
    if (isStreaming) {
      startCamera(newDeviceId);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (frameSenderIntervalRef.current) {
      clearInterval(frameSenderIntervalRef.current);
      frameSenderIntervalRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    detectionsRef.current = [];
    setIsStreaming(false);
    setIsServerConnected(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="livefeed-container">
      <div className="livefeed-header">
        <div className="livefeed-header-content">
          <div>
            <h1>
              <Radio size={28} className="header-icon pulse" />
              {t("live_feed")}
            </h1>
            <p>{t("live_feed_subtitle")}</p>
          </div>
          <button
            className="phone-guide-toggle-btn"
            onClick={() => setShowPhoneGuide(!showPhoneGuide)}
          >
            <Smartphone size={18} />
            <span>{showPhoneGuide ? "Hide Phone Guide" : "📱 Use iPhone Wirelessly"}</span>
          </button>
        </div>
      </div>

      {/* Wireless iPhone Connection Guide Card */}
      {showPhoneGuide && (
        <div className="phone-guide-card">
          <div className="phone-guide-header">
            <div className="phone-guide-title">
              <Wifi size={20} className="wifi-icon" />
              <h3>How to use your iPhone Camera Wirelessly:</h3>
            </div>
            <button
              className="close-guide-btn"
              onClick={() => setShowPhoneGuide(false)}
            >
              ✕
            </button>
          </div>

          <div className="phone-guide-grid">
            <div className="phone-guide-option highlight">
              <div className="option-badge">⚡ Fastest & Best (0 Installs)</div>
              <h4>Option 1: Open on iPhone Directly</h4>
              <p>Connect your iPhone to the same Wi-Fi as your Mac, open Safari on your iPhone, and go to:</p>
              <div className="ip-url-badge">
                <code>http://10.173.3.24:5173/live-feed</code>
              </div>
              <p className="option-subtext">
                Your iPhone will use its own camera and run the live AI detection HUD directly!
              </p>
            </div>

            <div className="phone-guide-option">
              <div className="option-badge">🎥 100% Reliable Webcam</div>
              <h4>Option 2: Use Camo or Iriun App</h4>
              <p>
                Install <strong>Camo</strong> (by Reincubate) or <strong>Iriun Webcam</strong> on your iPhone and Mac.
              </p>
              <p className="option-subtext">
                It instantly streams 1080p/4K wirelessly to your Mac browser — then click <strong>"Scan"</strong> below and select it from the dropdown!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="feed-controls">
        <button
          className={`control-btn ${isStreaming ? "stop" : "start"}`}
          onClick={isStreaming ? stopCamera : () => startCamera()}
        >
          {isStreaming ? <VideoOff size={20} /> : <Video size={20} />}
          {isStreaming ? t("stop_feed") : t("start_feed")}
        </button>

        <div className="camera-controls-group">
          <div className="camera-select-wrapper">
            <Camera size={18} className="camera-select-icon" />
            <select
              className="camera-select"
              value={selectedDeviceId}
              onChange={handleDeviceChange}
              title={t("select_camera")}
            >
              {devices.length === 0 ? (
                <option value="">{t("default_camera")}</option>
              ) : (
                devices.map((device, idx) => (
                  <option key={device.deviceId || idx} value={device.deviceId}>
                    {device.label || `Camera ${idx + 1}`}
                  </option>
                ))
              )}
            </select>
          </div>

          <button
            className={`control-btn refresh-btn ${isRefreshingDevices ? "spinning" : ""}`}
            onClick={() => refreshCameras(false)}
            title="Scan for wireless iPhone / new cameras"
          >
            <RefreshCw size={16} className={isRefreshingDevices ? "spin-icon" : ""} />
            <span>Scan</span>
          </button>
        </div>

        <button
          className={`control-btn toggle ${showDetections ? "active" : ""}`}
          onClick={() => setShowDetections(!showDetections)}
          disabled={!isStreaming}
        >
          {showDetections ? <Eye size={20} /> : <EyeOff size={20} />}
          {showDetections ? t("hide_detections") : t("show_detections")}
        </button>

        <div className={`ai-engine-status ${isServerConnected ? "connected" : "offline"}`}>
          <Zap size={15} />
          <span>{isServerConnected ? "AI: YOLOv8 PyTorch Active" : "AI: Offline Simulator"}</span>
        </div>

        <div className={`connection-status ${isStreaming ? "connected" : ""}`}>
          <span className="status-dot" />
          {isStreaming ? t("connected") : t("disconnected")}
        </div>
      </div>

      {/* Camera Error Banner */}
      {cameraError && isStreaming && (
        <div className="camera-error-banner">
          <AlertTriangle size={18} />
          {t("camera_error")}
        </div>
      )}

      {/* Video Feed */}
      <div className="feed-viewport" ref={containerRef}>
        <video
          ref={videoRef}
          className="feed-video"
          playsInline
          muted
          style={{
            display: cameraError || !isStreaming ? "none" : "block",
          }}
        />
        <canvas ref={canvasRef} className="feed-canvas" />

        {!isStreaming && (
          <div className="feed-placeholder">
            <Video size={64} />
            <p>{t("start_feed")}</p>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="feed-stats">
        <div className="feed-stat">
          <div className="feed-stat-icon disease-icon">
            <Leaf size={22} />
          </div>
          <div>
            <span className="feed-stat-value">{stats.diseases}</span>
            <span className="feed-stat-label">{t("diseases_found")}</span>
          </div>
        </div>
        <div className="feed-stat">
          <div className="feed-stat-icon pest-icon">
            <Bug size={22} />
          </div>
          <div>
            <span className="feed-stat-value">{stats.pests}</span>
            <span className="feed-stat-label">{t("pests_found")}</span>
          </div>
        </div>
        <div className="feed-stat">
          <div className="feed-stat-icon total-icon">
            <Zap size={22} />
          </div>
          <div>
            <span className="feed-stat-value">{stats.total}</span>
            <span className="feed-stat-label">{t("total_detections")}</span>
          </div>
        </div>
      </div>

      {/* Detection Log */}
      <div className="detection-log-section">
        <h2>{t("detection_log")}</h2>
        <div className="detection-log">
          {detectionLog.length === 0 ? (
            <p className="no-detections">{t("no_detections")}</p>
          ) : (
            detectionLog.map((det) => (
              <div
                key={det.id}
                className={`log-entry ${det.type === "DISEASE" ? "disease" : "pest"}`}
              >
                <span className="log-time">[{det.timestamp}]</span>
                <span className={`log-type ${det.type.toLowerCase()}`}>
                  {det.type === "DISEASE" ? "🍂" : "🐛"} {det.type}
                </span>
                <span className="log-name">
                  {det.name.replace(/_/g, " ")}
                </span>
                <span className="log-confidence">{det.confidence}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
