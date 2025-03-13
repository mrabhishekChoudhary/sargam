import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaRocket } from "react-icons/fa";

const Home = () => {
  useEffect(() => {
    const stars = [];
    const numStars = 50;
    const container = document.querySelector(".stars-container");

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(star);
      stars.push(star);
    }

    return () => stars.forEach((star) => star.remove());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950 text-white flex flex-col overflow-hidden relative">
      {/* Background Stars */}
      <div className="stars-container absolute inset-0 pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-16 text-center pt-20">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-6 drop-shadow-lg animate-fade-in">
          Welcome to Sargam
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 animate-fade-in-delay">
          Unleash your musical journey—connect with artists, discover tracks, and share your own beats with the universe.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white text-lg font-semibold shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(236,72,153,0.7)]"
          >
            <FaRocket className="mr-3" /> Join the Vibe
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-purple-400 rounded-full text-purple-300 text-lg font-semibold hover:bg-purple-400/20 hover:text-white transition-all duration-300 hover:scale-105"
          >
            <FaPlay className="mr-3" /> Dive In
          </Link>
        </div>

        {/* Featured Preview */}
        <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[            { title: "Cosmic Beats", artist: "DJ Nebula" },            { title: "Lunar Vibes", artist: "Synthwave Star" },            { title: "Galactic Groove", artist: "Echo Pulse" },          ].map((track, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-gray-850/90 to-gray-900/90 rounded-xl shadow-lg border border-purple-800/50 p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative group">
                <div className="w-full h-40 bg-gradient-to-br from-purple-900 to-gray-800 rounded-lg flex items-center justify-center">
                  <FaPlay className="text-3xl text-purple-400 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mt-3 truncate">{track.title}</h3>
              <p className="text-sm text-gray-400">{track.artist}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;