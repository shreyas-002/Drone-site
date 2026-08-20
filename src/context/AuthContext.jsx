import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userDataWithDefaults = {
      id: userData.id || Date.now(),
      email: userData.email,
      name: userData.name || "",
      phone: userData.phone || "",
      location: userData.location || "",
      fields: userData.fields || [],
      scanTime: userData.scanTime || "06:00",
      timerHours: userData.timerHours || 24,
      timerMinutes: userData.timerMinutes || 0,
      ...userData,
    };
    setUser(userDataWithDefaults);
    localStorage.setItem("user", JSON.stringify(userDataWithDefaults));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const addField = (field) => {
    const updatedFields = [
      ...(user.fields || []),
      { ...field, id: Date.now() },
    ];
    updateProfile({ fields: updatedFields });
  };

  const updateField = (fieldId, updates) => {
    const updatedFields = (user.fields || []).map((field) =>
      field.id === fieldId ? { ...field, ...updates } : field,
    );
    updateProfile({ fields: updatedFields });
  };

  const deleteField = (fieldId) => {
    const updatedFields = (user.fields || []).filter(
      (field) => field.id !== fieldId,
    );
    updateProfile({ fields: updatedFields });
  };

  const updateDroneSettings = (scanTime, timerHours, timerMinutes) => {
    updateProfile({ scanTime, timerHours, timerMinutes });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateProfile,
        addField,
        updateField,
        deleteField,
        updateDroneSettings,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
