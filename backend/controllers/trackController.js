const Track = require("../models/Track");
const musicMetadata = require("music-metadata");
const path = require("path");

// ✅ Upload Track
const uploadTrack = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, language } = req.body;

    // Validate language selection
    const validLanguages = ["Hindi", "English", "Punjabi", "Bhojpuri", "Haryanvi"];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({ message: "Invalid language selection" });
    }

    const newTrack = new Track({
      title,
      filePath: req.file.path,
      uploadedBy: req.user.id,
      language, // Save language in DB
    });

    await newTrack.save();
    res.json({ message: "Track uploaded successfully", track: newTrack });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get All Tracks
// ✅ Get All Tracks (Updated with Thumbnail Extraction)
const getTracks = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    let query = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const tracks = await Track.find(query)
      .populate("uploadedBy", "username");

    const totalTracks = await Track.countDocuments(query);

    // Loop through each track to parse metadata and add thumbnails
    const tracksWithMetadata = await Promise.all(tracks.map(async (track) => {
      // Construct the full file path
      const filePath = path.join(__dirname, "..", track.filePath);
      console.log("Parsing file:", filePath);

      // Parse MP3 metadata for thumbnail
      const metadata = await musicMetadata.parseFile(filePath);
      const picture = metadata.common.picture?.[0]; // Get the first embedded image
      let thumbnailUrl = null;
      if (picture) {
        thumbnailUrl = `data:${picture.format};base64,${Buffer.from(picture.data).toString("base64")}`;
      }

      return {
        ...track.toObject(),
        thumbnailUrl, // Add the thumbnail to each track object
      };
    }));

    res.json({
      tracks: tracksWithMetadata,
      totalPages: Math.ceil(totalTracks / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Track by ID (Updated with Thumbnail Extraction)
const getTrackById = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id).populate("uploadedBy", "username");
    if (!track) return res.status(404).json({ message: "Track not found" });

    const filePath = path.join(__dirname, "..", track.filePath);
    const metadata = await musicMetadata.parseFile(filePath);
    const picture = metadata.common.picture?.[0];
    let thumbnailUrl = picture ? `data:${picture.format};base64,${Buffer.from(picture.data).toString("base64")}` : null;

    res.json({
      title: track.title,
      uploadedBy: { _id: track.uploadedBy._id, username: track.uploadedBy.username },
      fileUrl: `http://localhost:5000/${track.filePath}`,
      thumbnailUrl,
      likes: track.likes || [], // Ensure likes is included
    });
  } catch (error) {
    console.error("Error fetching track:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Track Title
const updateTrack = async (req, res) => {
  try {
    const { title } = req.body;
    const track = await Track.findById(req.params.id);

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    track.title = title || track.title;
    await track.save();

    res.json({ message: "Track updated successfully", track });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Toggle Like on Track
const toggleLike = async (req, res) => {
  try {
    const track = await Track.findById(req.params.trackId);
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    const userId = req.user.id;
    const isLiked = track.likes.includes(userId);

    if (isLiked) {
      track.likes = track.likes.filter((id) => id.toString() !== userId);
    } else {
      track.likes.push(userId);
    }

    await track.save();
    res.json({ message: "Like status updated", likes: track.likes.length });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete Track
const deleteTrack = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);

    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }

    if (track.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own tracks" });
    }

    await track.deleteOne();
    res.json({ message: "Track deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { uploadTrack, getTracks, getTrackById, updateTrack, toggleLike, deleteTrack };