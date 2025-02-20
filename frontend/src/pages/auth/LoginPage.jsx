import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../../components/InputField.jsx";
import Button from "../../components/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email wajib diisi!";
    }
    if (!password) {
      newErrors.password = "Password wajib diisi!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    login(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
          </div>
          <div className="mb-4">
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
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-center">
          belum punya akun?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            register disini
          </Link>
        </p>
      </div>
    </div>
  );
}
