import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../../components/InputField.jsx";
import Button from "../../components/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({}); // Change to errors object

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors on new submission
    
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email wajib diisi!";
    }
    if (!password) {
      newErrors.password = "Password wajib diisi!";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi!";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password dan konfirmasi password tidak cocok!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      register(email, password, email);
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
          {errors.general && (
            <p className="text-red-500 text-sm mt-2 mb-4">{errors.general}</p>
          )}
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-center">
          sudah punya akun?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            login disini
          </Link>
        </p>
      </div>
    </div>
  );
}
