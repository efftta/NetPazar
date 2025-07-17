import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (tokenFromStorage && userData && userData !== "undefined") {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setAuthToken(tokenFromStorage);
        setUser(parsedUser);
      } catch (e) {
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setAuthToken(null);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLoginUser(email, password);
      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }

      setIsAuthenticated(true);
      setAuthToken(data.token);
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    try {
      const data = await apiRegisterUser(username, email, password, confirmPassword);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = (updatedUserData) => {
    localStorage.setItem("user", JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, token: authToken, login, logout, register, setUser: updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
