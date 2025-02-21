import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    return initials.toUpperCase();
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Added state for dropdown

  const categories = ["Category 1", "Category 2", "Category 3"]; // Dummy array for categories

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-3">
        <span className="text-xl font-bold flex items-center">
          <span className="text-black">⚡</span> Wacana
        </span>
      </Link>
      <div className="hidden md:flex space-x-6 text-gray-700">
        <div className="relative group">
          <button
            onClick={toggleDropdown}
            onBlur={() => setIsDropdownOpen(false)} // Close dropdown on blur
            className="hover:text-black focus:outline-none"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            Categories ▼
          </button>
          <div
            className={`absolute left-0 mt-2 w-48 bg-white border overflow-hidden rounded-lg shadow-lg z-50 ${
              isDropdownOpen ? "block" : "hidden"
            }`}
          >
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/category/${category}`}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
        <Link to="/favorite" className="hover:text-black">
          Favorit
        </Link>
        <Link to="/about" className="hover:text-black">
          About
        </Link>
      </div>
      <div className="flex space-x-4 items-center">
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-4" >
              {user.photo_profile ? (
                <img
                  src={user.photo_profile}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                  <span className="text-white">
                    {getInitials(user.username)}
                  </span>
                </div>
              )}
              <span>{user.username}</span>
            </Link>
            <button
              onClick={logout}
              className="text-gray-700 hover:text-black focus:outline-none border border-gray-500 rounded-md py-1 px-3"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-black">
              Log in
            </Link>
            <Link
              to="/register"
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 focus:outline-none"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
