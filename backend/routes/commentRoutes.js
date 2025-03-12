const express = require("express");
const { addComment, getComments, deleteComment } = require("../controllers/commentController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/:trackId", protect, addComment);
router.get("/:trackId", getComments);
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
