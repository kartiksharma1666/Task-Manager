import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State for user
  const navigate = useNavigate(); // useNavigate hook for navigation

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token); // Save token to localStorage
      setUser({ email }); // Set user data
      navigate("/dashboard"); // Navigate to dashboard after successful login
    } catch (err) {
      console.error(err.response.data.error); // Handle login error
    }
  };

  const register = async (email, password) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", { email, password });
      navigate("/login"); // Navigate to login page after successful registration
    } catch (err) {
      console.error(err.response.data.error); // Handle registration error
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setUser(null); // Clear user state
    navigate("/login"); // Redirect to login page
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // Check if token exists in localStorage
    if (token) setUser({}); // If token exists, set user state (simulate logged-in state)
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
