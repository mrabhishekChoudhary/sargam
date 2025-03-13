const Comment = require("../models/Comment");
const Track = require("../models/Track");

// ✅ Add a Comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { trackId } = req.params;

    const track = await Track.findById(trackId);
    if (!track) return res.status(404).json({ message: "Track not found" });

    const newComment = new Comment({
      track: trackId,
      user: req.user.id,
      text
    });

    await newComment.save();
    res.json({ message: "Comment added", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get All Comments for a Track
const getComments = async (req, res) => {
  try {
    const { trackId } = req.params;
    const comments = await Comment.find({ track: trackId }).populate("user", "username");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete a Comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addComment, getComments, deleteComment };
