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
      alert(
        "Register Gagal: " +
          JSON.stringify(error?.response?.data?.errors || "Server error")
      );
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
      alert("Login Berhasil: " + response.data.message);
      const userData = {
        email,
        name: email,
        profilePic: "https://i.pravatar.cc/50",
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(
        "Login Gagal: " +
          JSON.stringify(error?.response?.data?.errors || "Server error")
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, logout, register, login, loading };
}
