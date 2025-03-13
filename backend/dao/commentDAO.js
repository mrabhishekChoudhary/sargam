const Comment = require("../models/Comment");

const createComment = async (userId, trackId, text) => {
  return await Comment.create({ userId, trackId, text });
};

const getCommentsByTrack = async (trackId) => {
  return await Comment.find({ trackId }).populate("userId", "username");
};

module.exports = { createComment, getCommentsByTrack };
