const Track = require("../models/Track");

const createTrack = async (trackData) => {
  const track = new Track(trackData);
  return await track.save();
};

const getAllTracks = async () => await Track.find().populate("uploadedBy", "username");

const getTrackById = async (id) => await Track.findById(id).populate("uploadedBy", "username");

const toggleLike = async (trackId, userId) => {
  const track = await Track.findById(trackId);
  if (!track) throw new Error("Track not found");

  const index = track.likes.indexOf(userId);
  if (index === -1) {
    track.likes.push(userId); // Like the track
  } else {
    track.likes.splice(index, 1); // Unlike the track
  }

  await track.save();
  return track;
};


module.exports = { createTrack, getAllTracks, getTrackById, toggleLike };
