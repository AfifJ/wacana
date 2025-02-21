import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    const initials = name.split(' ').map(n => n[0]).join('');
    return initials.toUpperCase();
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="text-xl font-semibold">
        MyApp
      </Link>
      {user ? (
        <div className="flex items-center gap-4">
          <a className="flex items-center gap-4" href="/profile">
            {user.photo_profile ? (
              <img
                src={user.photo_profile}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                <span className="text-white">{getInitials(user.username)}</span>
              </div>
            )}
            <span>{user.username}</span>
          </a>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded-md">
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" className="bg-green-500 px-3 py-1 rounded-md">
          Login
        </Link>
      )}
    </nav>
  );
}
