import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AboutPage from "./pages/AboutPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import AuthLayout from "./routes/AuthRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import PostDetail from "./pages/articles/PostDetail"; // Import komponen PostDetail
import FavoritePage from "./pages/FavoritePage";
import CreateArticle from "./pages/articles/CreateArticle";
import MyPost from "./pages/MyPost";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="favorite" element={<FavoritePage />} />
        <Route path="post/:id" element={<PostDetail />} />
        <Route path="create" element={<CreateArticle />} />
        <Route path="posts/" element={<MyPost />} />
        <Route path="search/" element={<SearchPage />} />

        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
