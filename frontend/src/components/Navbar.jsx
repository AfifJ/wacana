import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="text-xl font-semibold">MyApp</Link>
      {user ? (
        <div className="flex items-center gap-4">
          <img src={user.profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
          <span>{user.name}</span>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded-md">Logout</button>
        </div>
      ) : (
        <Link to="/login" className="bg-green-500 px-3 py-1 rounded-md">Login</Link>
      )}
    </nav>
  );
}
