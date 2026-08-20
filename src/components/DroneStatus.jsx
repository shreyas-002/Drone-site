import React, { useState, useEffect } from "react";
import { Activity, Zap, Gauge, AlertTriangle } from "lucide-react";
import "../styles/DroneStatus.css";

const DroneStatus = () => {
  const [battery, setBattery] = useState(85);
  const [altitude, setAltitude] = useState(120);
  const [speed, setSpeed] = useState(0);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isFlying) {
        setBattery((prev) => Math.max(0, prev - Math.random() * 2));
        setAltitude((prev) => prev + (Math.random() - 0.5) * 5);
        setSpeed((prev) => parseInt((Math.random() * 15).toFixed(1)));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isFlying]);

  const getBatteryStatus = () => {
    if (battery > 60) return "good";
    if (battery > 30) return "warning";
    return "critical";
  };

  return (
    <div className="drone-status-widget">
      <div className="drone-status-title">
        <Activity size={20} className="title-icon" />
        <h3>Drone Status</h3>
        <div className={`status-indicator ${isFlying ? "flying" : "idle"}`}>
          {isFlying ? "Flying" : "Idle"}
        </div>
      </div>

      <div className="drone-metrics">
        <div className="metric-card">
          <div className="metric-header">
            <Zap size={18} />
            <span>Battery</span>
          </div>
          <div className={`metric-value battery-${getBatteryStatus()}`}>
            {battery.toFixed(1)}%
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill battery-${getBatteryStatus()}`}
              style={{ width: `${battery}%` }}
            />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Gauge size={18} />
            <span>Altitude</span>
          </div>
          <div className="metric-value">{altitude.toFixed(0)} m</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <AlertTriangle size={18} />
            <span>Speed</span>
          </div>
          <div className="metric-value">{speed} km/h</div>
        </div>
      </div>

      <div className="drone-controls">
        <button
          className={`control-button ${isFlying ? "active" : ""}`}
          onClick={() => setIsFlying(!isFlying)}
        >
          {isFlying ? "✓ Flying" : "Start Flight"}
        </button>
      </div>
    </div>
  );
};

export default DroneStatus;
