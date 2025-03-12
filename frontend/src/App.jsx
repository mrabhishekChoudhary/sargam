import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useContext, useState, useEffect } from "react";
import AuthContext from "./context/AuthContext";
import Tracks from "./pages/Tracks";
import Profile from "./pages/Profile";
import UploadTrack from "./pages/UploadTrack";
import TrackDetails from "./pages/TrackDetails";
import AudioPlayer from "./components/AudioPlayer.jsx";
import Footer from "./components/Footer.jsx";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-indigo-900 to-black">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext); // Add loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Loading...</p>
      </div>
    ); // Wait for AuthContext to initialize
  }
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={user ? <Navigate to="/tracks" /> : <Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/tracks"
            element={
              <ProtectedRoute>
                <Tracks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadTrack />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracks/:id"
            element={
              <ProtectedRoute>
                <TrackDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
        <AudioPlayer />
      </Layout>
    </Router>
  );
};

export default App;