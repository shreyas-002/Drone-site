import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Activity, AlertCircle, Clock, BarChart3 } from "lucide-react";
import DroneStatus from "../components/DroneStatus";
import ScanHistory from "../components/ScanHistory";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const calculateTimeRemaining = () => {
    if (!user) return;

    const now = new Date();
    const totalMinutesLeft = user.timerHours * 60 + user.timerMinutes;
    const nextScanTime = new Date(now.getTime() + totalMinutesLeft * 60000);

    const diff = nextScanTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeRemaining({ hours, minutes, seconds });
  };

  const totalArea = (user?.fields || []).reduce(
    (sum, field) => sum + (parseFloat(field.area) || 0),
    0,
  );
  const numberOfCrops = (user?.fields || []).length;
  const droneStatus = totalArea > 0 ? t("active") : t("inactive");

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>
          {t("welcome")}, {user?.name || "किसान"}
        </h1>
        <p>आपके ड्रोन का स्वास्थ्य और खेतों की जानकारी यहाँ देखें</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">{t("total_area")}</p>
            <h3>{totalArea.toFixed(2)} km²</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">{t("number_of_crops")}</p>
            <h3>{numberOfCrops}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">{t("drone_status")}</p>
            <h3
              className={
                droneStatus === t("active")
                  ? "status-active"
                  : "status-inactive"
              }
            >
              {droneStatus}
            </h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">{t("pending_scans")}</p>
            <h3>{numberOfCrops}</h3>
          </div>
        </div>
      </div>

      {/* Drone Status Widget */}
      <DroneStatus />

      {/* Auto-Launch Timer */}
      <div className="timer-section">
        <h2>{t("time_until_launch")}</h2>
        <div className="timer-display">
          <div className="timer-unit">
            <span className="timer-value">
              {String(timeRemaining.hours || 0).padStart(2, "0")}
            </span>
            <span className="timer-label">{t("hours")}</span>
          </div>
          <span className="timer-separator">:</span>
          <div className="timer-unit">
            <span className="timer-value">
              {String(timeRemaining.minutes || 0).padStart(2, "0")}
            </span>
            <span className="timer-label">{t("minutes")}</span>
          </div>
          <span className="timer-separator">:</span>
          <div className="timer-unit">
            <span className="timer-value">
              {String(timeRemaining.seconds || 0).padStart(2, "0")}
            </span>
            <span className="timer-label">Seconds</span>
          </div>
        </div>
        <p className="timer-note">
          ड्रोन इस समय के बाद स्वचालित रूप से आपके खेतों को स्कैन करेगा
        </p>
      </div>

      {/* My Fields Section */}
      <div className="fields-section">
        <h2>{t("my_fields")}</h2>
        {user?.fields && user.fields.length > 0 ? (
          <div className="fields-grid">
            {user.fields.map((field) => (
              <div key={field.id} className="field-card">
                <h3>{field.name}</h3>
                <p>
                  <strong>फसल:</strong> {field.cropType}
                </p>
                <p>
                  <strong>क्षेत्र:</strong> {field.area} km²
                </p>
                <p>
                  <strong>स्कैन समय:</strong> {user.scanTime}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-fields">
            <p>{t("no_fields")}</p>
          </div>
        )}
      </div>

      {/* Scan Information */}
      <div className="scan-info">
        <div className="scan-info-card">
          <h3>{t("drone_coverage")}</h3>
          <p>आपका ड्रोन एक बार में 2 किमी² क्षेत्र को स्कैन कर सकता है</p>
        </div>
        <div className="scan-info-card">
          <h3>{t("scan_schedule")}</h3>
          <p>दैनिक स्कैन समय: {user?.scanTime}</p>
        </div>
      </div>

      {/* Scan History */}
      {user?.fields && user.fields.length > 0 && (
        <ScanHistory fields={user.fields} />
      )}
    </div>
  );
};

export default Dashboard;
