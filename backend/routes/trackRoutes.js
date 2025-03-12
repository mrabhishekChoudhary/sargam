const express = require("express");
const { uploadTrack, getTracks, getTrackById, updateTrack, toggleLike, deleteTrack } = require("../controllers/trackController");
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Apply 'protect' middleware to routes that need authentication
router.post("/upload", protect, upload.single("track"), uploadTrack);
router.get("/", getTracks);
router.get("/:id", getTrackById);
router.put("/:id", protect, updateTrack);
router.post("/:trackId/like", protect, toggleLike);
router.delete("/:id", protect, deleteTrack);

module.exports = router;
