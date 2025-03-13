const express = require("express");
const { getUserProfile, followUser, unfollowUser } = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/:id", protect, getUserProfile);
router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);

module.exports = router;