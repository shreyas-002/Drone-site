import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import DroneSettings from "./pages/DroneSettings";
import FieldManagement from "./pages/FieldManagement";
import LiveFeed from "./pages/LiveFeed";
import Heatmap from "./pages/Heatmap";
import "./styles/global.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "1.2rem",
          color: "#666",
        }}
      >
        लोड हो रहा है...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Main App Component
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DroneSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fields"
          element={
            <ProtectedRoute>
              <FieldManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live-feed"
          element={
            <ProtectedRoute>
              <LiveFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/heatmap"
          element={
            <ProtectedRoute>
              <Heatmap />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

// Root App Component with Providers
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
