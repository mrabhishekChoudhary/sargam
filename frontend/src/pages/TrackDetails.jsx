// src/pages/TrackDetails.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useAudio } from "../context/AudioContext";
import {
  FaHeart,
  FaComment,
  FaUserPlus,
  FaUserCheck,
  FaSpinner,
  FaPlay,
  FaPause,
  FaMusic,
} from "react-icons/fa";

const TrackDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const {
    initializePlayer,
    currentTrack,
    isPlaying,
    togglePlayPause,
    setShowPlayer,
  } = useAudio();
  const [track, setTrack] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const loggedInUserId = user?.id;

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    const fetchTrackData = async () => {
      setLoading(true);
      setError(null);
      try {
        const trackResponse = await fetch(
          `http://localhost:5000/api/tracks/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!trackResponse.ok)
          throw new Error(`Failed to fetch track: ${trackResponse.status}`);
        const trackData = await trackResponse.json();
        console.log("Track Data Full:", trackData);

        const commentsResponse = await fetch(
          `http://localhost:5000/api/comments/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!commentsResponse.ok) throw new Error("Failed to fetch comments");
        const commentsData = await commentsResponse.json();

        const userResponse = await fetch(
          `http://localhost:5000/api/users/${loggedInUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        const followingList = (userData.following || []).map((f) =>
          f._id.toString()
        );
        const isFollowing = trackData.uploadedBy?._id
          ? followingList.includes(trackData.uploadedBy._id.toString())
          : false;

        const newTrack = {
          ...trackData,
          _id: trackData._id || id,
          likes: Array.isArray(trackData.likes) ? trackData.likes : [],
          comments: commentsData,
          isFollowing,
        };
        setTrack(newTrack);
        // Removed initializePlayer from here
      } catch (error) {
        console.error("Error fetching track data:", error);
        setError(error.message);
        setTrack(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTrackData();
  }, [id, token, loggedInUserId, navigate, user]); // Removed initializePlayer from dependencies

  const handlePlayClick = () => {
    console.log("Play/Pause clicked, currentTrack:", currentTrack, "isPlaying:", isPlaying);
    if (!track) return;

    if (!currentTrack || currentTrack.id !== track?._id) {
      initializePlayer({
        id: track._id || id,
        title: track.title,
        fileUrl: track.fileUrl,
      });
      setShowPlayer(true); // Show player explicitly
      setTimeout(() => togglePlayPause(), 100); // Delay to ensure player is ready
    } else {
      togglePlayPause();
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tracks/${id}/like`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to toggle like");
      const { likes } = await response.json();
      setTrack((prev) => ({
        ...prev,
        likes: prev.likes.includes(loggedInUserId)
          ? prev.likes.filter((id) => id !== loggedInUserId)
          : [...prev.likes, loggedInUserId],
      }));
    } catch (err) {
      console.error("Error liking track:", err);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      const { comment } = await response.json();
      setTrack((prev) => ({
        ...prev,
        comments: [...prev.comments, comment],
      }));
      setCommentText("");
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  const handleFollow = async () => {
    if (!track?.uploadedBy?._id) {
      console.error("Cannot follow: uploadedBy._id is undefined");
      setError("User data missing");
      return;
    }
    const endpoint = track.isFollowing
      ? `/api/users/${track.uploadedBy._id}/unfollow`
      : `/api/users/${track.uploadedBy._id}/follow`;
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok)
        throw new Error(
          `Failed to ${track.isFollowing ? "unfollow" : "follow"} user`
        );
      setTrack((prev) => ({ ...prev, isFollowing: !prev.isFollowing }));
    } catch (err) {
      console.error("Error in handleFollow:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950 text-white">
        <FaSpinner className="animate-spin mr-3" size={30} />
        <p className="text-xl font-semibold">Loading Track...</p>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400">Error</h1>
          <p className="mt-2 text-gray-300">
            {error || "Track not found or failed to load."}
          </p>
        </div>
      </div>
    );
  }

  const isCurrentTrackPlaying = isPlaying && currentTrack?.id === track._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950 text-white pt-16 pb-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-gradient-to-b from-gray-850/90 to-gray-900/90 rounded-xl shadow-2xl p-6 border border-purple-900/40">
          <div className="relative mb-6">
            {track.thumbnailUrl ? (
              <img
                src={track.thumbnailUrl}
                alt={`${track.title} thumbnail`}
                className="w-full h-64 object-cover rounded-lg shadow-lg border border-purple-800/50"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-800 rounded-lg shadow-lg border border-purple-800/50">
                <FaMusic size={50} className="text-purple-500" />
              </div>
            )}

            <button
              onClick={handlePlayClick}
              className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-full text-white shadow-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              {isCurrentTrackPlaying ? (
                <FaPause size={20} />
              ) : (
                <FaPlay size={20} />
              )}
            </button>
          </div>

          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
            {track.title}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            by{" "}
            <span className="text-purple-300 hover:text-purple-200 transition-colors duration-200 cursor-pointer">
              {track.uploadedBy.username}
            </span>
          </p>
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 text-lg transition-all duration-300 ${
                track.likes.includes(loggedInUserId)
                  ? "text-red-400 hover:text-red-500"
                  : "text-gray-300 hover:text-red-400"
              }`}
            >
              <FaHeart
                className={
                  track.likes.includes(loggedInUserId) ? "fill-current" : ""
                }
              />
              <span>{track.likes.length}</span>
            </button>
            <div className="flex items-center space-x-2 text-lg text-gray-300">
              <FaComment />
              <span>{track.comments.length}</span>
            </div>
          </div>
          {track.uploadedBy._id !== loggedInUserId && (
            <button
              onClick={handleFollow}
              className={`mt-6 w-full py-2 rounded-full flex items-center justify-center space-x-2 text-base font-medium transition-all duration-300 shadow-md ${
                track.isFollowing
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
              }`}
            >
              {track.isFollowing ? (
                <>
                  <FaUserCheck />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <FaUserPlus />
                  <span>Follow</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="lg:col-span-2 bg-gradient-to-b from-gray-850/90 to-gray-900/90 rounded-xl shadow-2xl p-6 border border-purple-900/40">
          <h2 className="text-2xl font-semibold text-gray-100 mb-6">
            Community Feedback
          </h2>
          <div className="flex space-x-4 mb-6">
            <input
              type="text"
              placeholder="Drop your vibe..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-gray-800/80 text-white p-4 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-800/50 placeholder-gray-400 transition-all duration-200"
            />
            <button
              onClick={handleComment}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 px-8 py-4 rounded-r-xl text-white font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-md"
            >
              Post
            </button>
          </div>
          <div className="max-h-[calc(100vh-400px)] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-900">
            {track.comments.length === 0 ? (
              <p className="text-gray-400 text-center py-6">
                No vibes yet. Be the first to drop one!
              </p>
            ) : (
              track.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-800/90 p-4 rounded-lg border border-purple-800/40 hover:bg-gray-750/90 transition-all duration-200 shadow-sm"
                >
                  <p className="text-sm">
                    <strong className="text-purple-300">
                      {comment.user.username}
                    </strong>
                    <span className="text-gray-200 ml-3">{comment.text}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetails;