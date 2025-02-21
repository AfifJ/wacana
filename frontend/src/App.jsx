import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import AuthLayout from "./routes/AuthRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import PostDetail from "./pages/PostDetail"; // Import komponen PostDetail

function App() {
  return (
    <Routes>
      {/* Route untuk HomePage */}
      <Route index element={<HomePage />} />

      {/* Route untuk AboutPage */}
      <Route path="about" element={<AboutPage />} />

      {/* Route untuk Auth (Login dan Register) */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Route untuk ProfilePage (Protected) */}
      <Route element={<ProtectedRoute />}>
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Route untuk Detail Post */}
      <Route path="post/:id" element={<PostDetail />} />
    </Routes>
  );
}

export default App;