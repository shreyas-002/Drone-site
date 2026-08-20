import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { User, Phone, MapPin } from "lucide-react";
import "../styles/Profile.css";

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setMessage("प्रोफाइल सफलतापूर्वक अपडेट हुई!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{t("profile")}</h1>
        <p>अपनी जानकारी देखें और संपादित करें</p>
      </div>

      {message && <div className="success-message">{message}</div>}

      <div className="profile-content">
        <div className="profile-avatar">
          <User size={80} />
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">{t("farmer_name")}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t("email")}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t("phone")}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">{t("location")}</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="button-group">
              <button type="submit" className="save-button">
                {t("save")}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <User size={20} />
              <div className="info-content">
                <label>{t("farmer_name")}</label>
                <p>{user?.name}</p>
              </div>
            </div>

            <div className="info-row">
              <span className="icon">✉️</span>
              <div className="info-content">
                <label>{t("email")}</label>
                <p>{user?.email}</p>
              </div>
            </div>

            <div className="info-row">
              <Phone size={20} />
              <div className="info-content">
                <label>{t("phone")}</label>
                <p>{user?.phone || "कोई जानकारी नहीं"}</p>
              </div>
            </div>

            <div className="info-row">
              <MapPin size={20} />
              <div className="info-content">
                <label>{t("location")}</label>
                <p>{user?.location || "कोई जानकारी नहीं"}</p>
              </div>
            </div>

            <button className="edit-button" onClick={() => setIsEditing(true)}>
              {t("edit")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
