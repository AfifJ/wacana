import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });
  const navigate = useNavigate();

  const register = async (email, password, name) => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/register", {
        email,
        password,
        name,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      alert("Register Berhasil: " + data.message);
      const userData = {
        email,
        name,
        profilePic: "https://i.pravatar.cc/50",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      // navigate("/profile");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateProfile = async (userId, updateData) => {
    setLoading(true);
    try {
      const response = await axios.put(`http://127.0.0.1:5000/auth/profile/${userId}`, updateData);
      alert(response.data.message);
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  return { user, logout, register, login, loading, updateProfile };
}