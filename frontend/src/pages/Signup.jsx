import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaUserPlus, FaRocket } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log("Sending signup data:", formData);
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Server response:", data);
      if (!res.ok) throw new Error(data.message || "Signup failed");
      login(data.token); // Assuming backend returns a token
      navigate("/tracks"); // Redirect to tracks after signup
    } catch (err) {
      console.error("Signup error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950 text-white flex items-center justify-center overflow-hidden pt-20 pb-20">
      <div className="w-full max-w-md p-8 bg-gradient-to-b from-gray-850/90 to-gray-900/90 rounded-xl shadow-2xl shadow-purple-800/50 border border-purple-800/50 transform transition-all duration-500 hover:shadow-[0_0_25px_rgba(147,51,234,0.6)]">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6 drop-shadow-lg animate-fade-in">
          Join Sargam
        </h2>
        <p className="text-center text-gray-300 mb-6 animate-fade-in-delay">
          Create your account and start your musical journey!
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm animate-slide-up">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-4 bg-gray-800/80 text-white rounded-lg border border-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 animate-slide-up"
              required
            />
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 bg-gray-800/80 text-white rounded-lg border border-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 animate-slide-up"
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 bg-gray-800/80 text-white rounded-lg border border-purple-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 animate-slide-up"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(236,72,153,0.7)] transition-all duration-300 flex items-center justify-center animate-slide-up"
          >
            <FaUserPlus className="mr-2" /> Sign Up
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm animate-fade-in-delay">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-300 hover:text-purple-400 transition-colors duration-200"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;