import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaSignOutAlt, FaUser, FaUpload } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-purple-950 to-indigo-950 p-4 flex justify-between items-center shadow-lg shadow-purple-800/30 sticky top-0 z-50">
      <Link
        to={user ? "/tracks" : "/"}
        className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-300 hover:to-purple-300 transition-all duration-300 drop-shadow-md"
      >
        Sargam
      </Link>
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <Link
              to="/tracks"
              className="text-white text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-[0_0_10px_rgba(147,51,234,0.5)]"
            >
              Home
            </Link>
            <Link
              to="/profile"
              className="text-white text-lg font-medium hover:text-purple-300 transition-colors duration-200 flex items-center"
            >
              <FaUser className="mr-2" /> Profile
            </Link>
            <Link
              to="/upload"
              className="text-white text-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-[0_0_10px_rgba(147,51,234,0.5)]"
            >
              <FaUpload className="inline mr-2" /> Upload
            </Link>
            <button
              onClick={handleLogout}
              className="text-white bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] flex items-center"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-white text-lg font-medium hover:text-purple-300 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-white text-lg font-medium bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:shadow-[0_0_10px_rgba(236,72,153,0.5)]"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;