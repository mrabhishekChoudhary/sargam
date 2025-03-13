const userDAO = require("../dao/userDAO");

const followUser = async (userId, targetUserId) => {
  return await userDAO.followUser(userId, targetUserId);
};

const unfollowUser = async (userId, targetUserId) => {
  return await userDAO.unfollowUser(userId, targetUserId);
};

const getUserProfile = async (userId) => {
  return await userDAO.getUserProfile(userId);
};

module.exports = { followUser, unfollowUser, getUserProfile };
