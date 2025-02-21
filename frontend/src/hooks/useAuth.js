import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    return JSON.parse(sessionStorage.getItem("user")) || null;
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
      // axios sudah mengembalikan data di response.data
      alert("Register Berhasil: " + response.data.message);
      const userData = {
        email,
        name,
        profilePic: "https://i.pravatar.cc/50",
      };
      sessionStorage.setItem("user", JSON.stringify(userData));
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
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      sessionStorage.removeItem("user");
      setUser(null);
    }
  };

  const updateProfile = async (userId, updateData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/auth/profile/${userId}`,
        updateData
      );
      alert(response.data.message);
      setUser(response.data.user);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil profil user berdasarkan userId
  const getUserById = useCallback(async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/auth/profile/${userId}`);
      return response.data; // Asumsikan data profil mengandung field 'username'
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }, []);

  return { user, logout, register, login, loading, updateProfile, getUserById };
}