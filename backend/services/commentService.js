const commentDAO = require("../dao/commentDAO");

const addComment = async (userId, trackId, text) => {
  return await commentDAO.createComment(userId, trackId, text);
};

const getCommentsByTrack = async (trackId) => {
  return await commentDAO.getCommentsByTrack(trackId);
};

module.exports = { addComment, getCommentsByTrack };
