const trackDAO = require("../dao/trackDAO");

const uploadTrack = async (title, fileUrl, userId) => {
  return await trackDAO.createTrack({ title, fileUrl, uploadedBy: userId });
};

const fetchTracks = async () => {
  return await trackDAO.getAllTracks();
};

const fetchTrackById = async (id) => {
  return await trackDAO.getTrackById(id);
};

const toggleLike = async (trackId, userId) => {
  return await trackDAO.toggleLike(trackId, userId);
};

module.exports = { uploadTrack, fetchTracks, fetchTrackById, toggleLike };
