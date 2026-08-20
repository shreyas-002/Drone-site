import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Drone, Eye, EyeOff } from "lucide-react";
import "../styles/Login.css";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // Sample user data for demo
  const demoUsers = [
    {
      email: "farmer1@farmhawk.com",
      password: "password123",
      name: "राज कुमार",
      phone: "+91-9876543210",
      location: "हरियाणा",
    },
    {
      email: "farmer2@farmhawk.com",
      password: "password123",
      name: "प्रिया शर्मा",
      phone: "+91-9876543211",
      location: "पंजाब",
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("error"));
      return;
    }

    // Simple authentication check
    const user = demoUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      login({
        email: user.email,
        name: user.name,
        phone: user.phone,
        location: user.location,
        fields: [],
        scanTime: "06:00",
        timerHours: 24,
        timerMinutes: 0,
      });

      if (rememberMe) {
        localStorage.setItem("rememberEmail", email);
      }

      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Drone size={48} className="logo-icon" />
          <h1>{t("app_name")}</h1>
          <p>{t("app_subtitle")}</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">{t("email")}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@example.com"
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password">{t("password")}</label>
            <div className="password-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">{t("remember_me")}</label>
          </div>

          <button type="submit" className="login-button">
            {t("sign_in")}
          </button>
        </form>

        <div className="demo-credentials">
          <h3>Demo Credentials:</h3>
          <p>Email: farmer1@farmhawk.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
