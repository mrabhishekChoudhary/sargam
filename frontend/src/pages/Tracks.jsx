import { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlay, FaUserCircle, FaMusic, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AuthContext from "../context/AuthContext";

const Tracks = () => {
  const [tracks, setTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const loggedInUserId = user?.id;

  const scrollRefs = useRef({});
  const [scrollStates, setScrollStates] = useState({}); // State for scroll positions

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const usersResponse = await fetch("http://localhost:5000/api/users/All", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();
        const filteredArtists = usersData
          .filter((u) => u._id.toString() !== loggedInUserId)
          .sort((a, b) => b.followersCount - a.followersCount);
        setArtists(filteredArtists);

        const trackResponse = await fetch("http://localhost:5000/api/tracks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!trackResponse.ok) throw new Error("Failed to fetch tracks");
        const trackData = await trackResponse.json();

        const userResponse = await fetch(`http://localhost:5000/api/users/${loggedInUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        const followingList = (userData.following || []).map((followedUser) =>
          followedUser._id.toString()
        );

        const tracksWithComments = await Promise.all(
          trackData.tracks.map(async (track) => {
            const commentResponse = await fetch(`http://localhost:5000/api/comments/${track._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const comments = commentResponse.ok ? await commentResponse.json() : [];
            const uploadedById = track.uploadedBy._id.toString();
            const isFollowing = followingList.includes(uploadedById);
            return { ...track, comments, isFollowing };
          })
        );

        setTracks(tracksWithComments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate, user, loggedInUserId]);

  const updateScrollState = (sectionKey) => {
    const container = scrollRefs.current[sectionKey];
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    setScrollStates((prev) => ({
      ...prev,
      [sectionKey]: {
        canScrollLeft: scrollLeft > 0,
        canScrollRight: scrollLeft + clientWidth < scrollWidth - 1, // -1 for rounding
      },
    }));
  };

  const handleScroll = (sectionKey, direction) => {
    const container = scrollRefs.current[sectionKey];
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    // Update state after scroll
    setTimeout(() => updateScrollState(sectionKey), 300);
  };

  const languages = ["Hindi", "English", "Bhojpuri", "Haryanvi", "Punjabi"];
  const categorizedTracks = languages.reduce((acc, lang) => {
    acc[lang] = tracks.filter((track) => track.language === lang);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950">
        <div className="text-white text-4xl font-bold animate-pulse flex items-center">
          <FaMusic className="mr-4" size={40} /> Loading Your Beats...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold text-red-400">Oops!</h1>
          <p className="text-gray-300 mt-3 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const renderSection = (sectionKey, items, isArtists = false) => {
    const hasItems = items.length > 0;
    const cardWidth = 224; // w-56 = 14rem = 224px
    const gap = 24; // space-x-6 = 1.5rem = 24px
    const itemsPerView = Math.floor(window.innerWidth / (cardWidth + gap)) || 1; // Dynamic based on viewport
    const needsNavigation = items.length > itemsPerView;

    // Initialize scroll state if not present
    if (!scrollStates[sectionKey] && hasItems) {
      setScrollStates((prev) => ({
        ...prev,
        [sectionKey]: { canScrollLeft: false, canScrollRight: needsNavigation },
      }));
    }

    return (
      <section className="mb-12 relative">
        <h2 className="text-3xl font-semibold text-purple-300 mb-6">
          {isArtists ? "Popular Artists" : `${sectionKey} Tracks`}
        </h2>
        {hasItems ? (
          <div className="relative">
            <div
              ref={(el) => {
                scrollRefs.current[sectionKey] = el;
                if (el && !scrollStates[sectionKey]) updateScrollState(sectionKey);
              }}
              className="flex space-x-6 overflow-x-hidden pb-4 snap-x snap-mandatory"
              onScroll={() => updateScrollState(sectionKey)}
            >
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex-shrink-0 w-56 bg-gradient-to-b from-gray-850/90 to-gray-900/90 rounded-xl shadow-lg overflow-hidden border border-purple-800/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] snap-start"
                >
                  {isArtists ? (
                    <Link to={`/profile/${item._id}`} className="flex flex-col items-center p-6">
                      <FaUserCircle className="text-purple-400 w-24 h-24 mb-4 transition-transform duration-300 hover:scale-105" />
                      <p className="text-lg font-semibold text-gray-100 truncate w-full text-center">
                        {item.username}
                      </p>
                      <p className="text-sm text-gray-400">{item.followersCount} Followers</p>
                    </Link>
                  ) : (
                    <>
                      <div className="relative group">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={`${item.title} thumbnail`}
                            className="w-full h-56 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => (e.target.src = "/default-track.jpg")}
                          />
                        ) : (
                          <div className="w-full h-56 bg-gradient-to-br from-purple-900 to-gray-800 flex items-center justify-center rounded-t-xl transition-transform duration-300 group-hover:scale-105">
                            <FaMusic className="text-5xl text-purple-400 opacity-80" />
                          </div>
                        )}
                        <Link
                          to={`/tracks/${item._id}`}
                          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <FaPlay className="text-white text-4xl drop-shadow-md transform group-hover:scale-110 transition-transform duration-200" />
                        </Link>
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="text-lg font-semibold text-gray-100 truncate">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.uploadedBy.username}</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {needsNavigation && (
              <>
                <button
                  onClick={() => handleScroll(sectionKey, "left")}
                  disabled={!scrollStates[sectionKey]?.canScrollLeft}
                  className={`absolute -left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-md transition-all duration-300 ${
                    !scrollStates[sectionKey]?.canScrollLeft
                      ? "bg-gray-800/50 text-gray-500 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white opacity-80 hover:opacity-100 hover:scale-110 hover:shadow-[0_0_10px_rgba(147,51,234,0.7)]"
                  }`}
                >
                  <FaChevronLeft size={20} />
                </button>
                <button
                  onClick={() => handleScroll(sectionKey, "right")}
                  disabled={!scrollStates[sectionKey]?.canScrollRight}
                  className={`absolute -right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-md transition-all duration-300 ${
                    !scrollStates[sectionKey]?.canScrollRight
                      ? "bg-gray-800/50 text-gray-500 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white opacity-80 hover:opacity-100 hover:scale-110 hover:shadow-[0_0_10px_rgba(147,51,234,0.7)]"
                  }`}
                >
                  <FaChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-400">No {isArtists ? "artists" : `${sectionKey} tracks`} found.</p>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950 text-white flex flex-col">
      <main className="flex-1 px-6 md:px-12 py-16 overflow-y-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-12 drop-shadow-lg">
          Sargam Vibes
        </h1>

        {/* Popular Artists Section */}
        {renderSection("artists", artists, true)}

        {/* Categorized Tracks by Language */}
        {languages.map((language) => renderSection(language, categorizedTracks[language]))}

        {/* All Tracks Section */}
        {renderSection("All", tracks)}
      </main>
    </div>
  );
};

export default Tracks;