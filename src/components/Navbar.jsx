import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Drone,
  Home,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
} from "lucide-react";
import "../styles/Navbar.css";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowMenu(false);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setShowLanguageMenu(false);
  };

  const currentLang = i18n.language;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Drone size={32} className="brand-icon" />
          <span className="brand-name">{t("app_name")}</span>
        </div>

        <button className="menu-toggle" onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-menu ${showMenu ? "active" : ""}`}>
          <a
            href="/dashboard"
            className="nav-link"
            onClick={() => setShowMenu(false)}
          >
            <Home size={20} />
            <span>{t("dashboard")}</span>
          </a>

          <a
            href="/fields"
            className="nav-link"
            onClick={() => setShowMenu(false)}
          >
            <MapPin size={20} />
            <span>{t("farmer_data")}</span>
          </a>

          <a
            href="/profile"
            className="nav-link"
            onClick={() => setShowMenu(false)}
          >
            <Settings size={20} />
            <span>{t("profile")}</span>
          </a>

          <a
            href="/settings"
            className="nav-link"
            onClick={() => setShowMenu(false)}
          >
            <Settings size={20} />
            <span>{t("drone_settings")}</span>
          </a>

          <div className="nav-divider"></div>
        </div>

        <div className="navbar-right">
          <div className="language-selector-desktop">
            <button
              className="language-toggle"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <Globe size={20} />
              <span>{currentLang === "hi" ? "हिन्दी" : "English"}</span>
            </button>

            {showLanguageMenu && (
              <div className="language-menu">
                <button
                  className={`lang-option ${currentLang === "hi" ? "active" : ""}`}
                  onClick={() => changeLanguage("hi")}
                >
                  हिन्दी
                </button>
                <button
                  className={`lang-option ${currentLang === "en" ? "active" : ""}`}
                  onClick={() => changeLanguage("en")}
                >
                  English
                </button>
              </div>
            )}
          </div>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            <span>{t("logout")}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
