import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaUserCircle, FaMusic, FaUserPlus, FaUserCheck, FaPlay, FaHeart, FaComment } from "react-icons/fa";

const Profile = () => {
  const { user: loggedInUser } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const isOwnProfile = !id || id === loggedInUser?.id;

  useEffect(() => {
    if (!token || !loggedInUser) {
      navigate("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const profileId = isOwnProfile ? loggedInUser.id : id;
        const response = await fetch(`http://localhost:5000/api/users/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorText = await response.text();
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error(`Failed to fetch profile: ${response.status} - ${errorText}`);
        }
        const data = await response.json();

        // Fetch comments count for each track
        const tracksWithStats = await Promise.all(
          data.uploadedTracks.map(async (track) => {
            const commentResponse = await fetch(`http://localhost:5000/api/comments/${track._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const comments = commentResponse.ok ? await commentResponse.json() : [];
            return { ...track, commentsCount: comments.length };
          })
        );

        setProfileData({ ...data, uploadedTracks: tracksWithStats });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token, loggedInUser, id, navigate, isOwnProfile]);

  const handleFollow = async () => {
    if (isOwnProfile) return;
    const endpoint = profileData.isFollowing
      ? `/api/users/${profileData._id}/unfollow`
      : `/api/users/${profileData._id}/follow`;

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to ${profileData.isFollowing ? "unfollow" : "follow"}: ${errorText}`);
      }
      setProfileData((prev) => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1,
      }));
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white">
        <FaMusic className="animate-spin mr-2" size={30} />
        <p className="text-xl">Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500">Error</h1>
          <p className="mt-2 text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white">
      {/* Profile Header */}
      <div className="max-w-5xl mx-auto pt-12 pb-8 px-6">
        <div className="bg-gray-800/90 rounded-2xl shadow-xl p-8 border border-purple-700/50 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <FaUserCircle className="text-purple-400 w-28 h-28 md:w-40 md:h-40 transition-transform hover:scale-105" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20 blur-xl"></div>
          </div>
          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-4">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                {profileData.username}
              </h1>
              {!isOwnProfile && (
                <button
                  onClick={handleFollow}
                  className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-semibold text-white shadow-md transition-all duration-300 ${
                    profileData.isFollowing
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  }`}
                >
                  {profileData.isFollowing ? (
                    <>
                      <FaUserCheck size={18} />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <FaUserPlus size={18} />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <p className="text-gray-400 mt-2 text-lg">{profileData.email}</p>
            <div className="flex justify-center md:justify-start space-x-8 mt-6 text-gray-200">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-2xl font-bold text-purple-300">{profileData.uploadedTracks.length}</span>
                <span className="text-sm text-gray-400">Tracks</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-2xl font-bold text-purple-300">{profileData.followersCount}</span>
                <span className="text-sm text-gray-400">Followers</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-2xl font-bold text-purple-300">{profileData.followingCount}</span>
                <span className="text-sm text-gray-400">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Section */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <h2 className="text-3xl font-semibold text-purple-300 mb-6 text-center md:text-left">Uploaded Tracks</h2>
        {profileData.uploadedTracks.length === 0 ? (
          <p className="text-gray-400 text-center text-lg">No tracks uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {profileData.uploadedTracks.map((track) => (
              <Link
                to={`/tracks/${track._id}`}
                key={track._id}
                className="group bg-gray-800/95 rounded-xl shadow-lg overflow-hidden border border-purple-700/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:-translate-y-1"
              >
                <div className="relative">
                  {track.thumbnailUrl && track.thumbnailUrl !== "" ? (
                    <img
                      src={track.thumbnailUrl}
                      alt={`${track.title} thumbnail`}
                      className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => (e.target.src = "/default-track.jpg")}
                    />
                  ) : (
                    <div className="w-full h-52 bg-gradient-to-br from-purple-800 to-gray-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <FaMusic className="text-4xl text-purple-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FaPlay className="text-white text-3xl drop-shadow-md" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-lg font-semibold text-gray-100 truncate">{track.title}</p>
                  <div className="flex items-center space-x-4 mt-2 text-gray-400">
                    <div className="flex items-center space-x-1">
                      <FaHeart className="text-red-400" size={16} />
                      <span>{track.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaComment className="text-purple-400" size={16} />
                      <span>{track.commentsCount || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;