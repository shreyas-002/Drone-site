import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Drone, Settings, Clock } from "lucide-react";
import "../styles/DroneSettings.css";

const DroneSettings = () => {
  const { t } = useTranslation();
  const { user, updateDroneSettings } = useAuth();
  const [scanTime, setScanTime] = useState(user?.scanTime || "06:00");
  const [timerHours, setTimerHours] = useState(user?.timerHours || 24);
  const [timerMinutes, setTimerMinutes] = useState(user?.timerMinutes || 0);
  const [message, setMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    updateDroneSettings(scanTime, parseInt(timerHours), parseInt(timerMinutes));
    setMessage("ड्रोन सेटिंग्स सफलतापूर्वक सहेजी गईं!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="drone-settings-container">
      <div className="settings-header">
        <Drone size={32} />
        <h1>{t("drone_settings")}</h1>
        <p>अपने ड्रोन की सेटिंग्स को कस्टमाइज़ करें</p>
      </div>

      {message && <div className="success-message">{message}</div>}

      <form onSubmit={handleSave} className="settings-form">
        {/* Scan Time Settings */}
        <div className="settings-section">
          <div className="section-header">
            <Clock size={24} />
            <h2>{t("set_scan_time")}</h2>
          </div>
          <p className="section-description">
            यह वह समय है जिस पर ड्रोन हर दिन आपके खेतों को स्कैन करेगा
          </p>

          <div className="form-group">
            <label htmlFor="scanTime">दैनिक स्कैन समय (24 घंटा प्रारूप)</label>
            <input
              type="time"
              id="scanTime"
              value={scanTime}
              onChange={(e) => setScanTime(e.target.value)}
              className="time-input"
            />
          </div>
        </div>

        {/* Timer Settings */}
        <div className="settings-section">
          <div className="section-header">
            <Settings size={24} />
            <h2>{t("timer")}</h2>
          </div>
          <p className="section-description">
            ड्रोन को स्वचालित रूप से उड़ान भरने से पहले कितना समय प्रतीक्षा करनी
            चाहिए
          </p>

          <div className="timer-inputs">
            <div className="form-group">
              <label htmlFor="hours">{t("hours")}</label>
              <input
                type="number"
                id="hours"
                min="0"
                max="24"
                value={timerHours}
                onChange={(e) => setTimerHours(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="minutes">{t("minutes")}</label>
              <input
                type="number"
                id="minutes"
                min="0"
                max="59"
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(e.target.value)}
              />
            </div>
          </div>

          <div className="timer-info">
            <p>
              कुल समय:{" "}
              <strong>
                {parseInt(timerHours)} घंटे {parseInt(timerMinutes)} मिनट
              </strong>
            </p>
            <p className="info-note">
              ड्रोन {scanTime} पर स्कैन शुरू करेगा, लेकिन शुरुआत से{" "}
              {parseInt(timerHours)} घंटे {parseInt(timerMinutes)} मिनट पहले
              स्वचालित रूप से उड़ान भरेगा
            </p>
          </div>
        </div>

        {/* Drone Coverage Info */}
        <div className="info-card">
          <h3>{t("drone_coverage")}</h3>
          <div className="coverage-details">
            <p>
              आपका FarmHawk ड्रोन एक बार में <strong>2 किमी²</strong> का क्षेत्र
              कवर कर सकता है।
            </p>
            <p>
              यदि आपका कुल खेत का क्षेत्र 2 किमी² से अधिक है, तो सभी खेतों को
              स्कैन करने में कई उड़ानें लग सकती हैं।
            </p>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="save-button">
            {t("save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DroneSettings;
