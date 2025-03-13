const Track = require("../models/Track"); // ✅ Add this line

const User = require("../models/User");
const musicMetadata = require("music-metadata");
const path = require("path");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("username email followers following") // Adjust fields as needed
      .populate("followers", "username")
      .populate("following", "username");
    const usersWithCounts = users.map((user) => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      isFollowing: user.followers.some((f) => f._id.toString() === req.user.id.toString()),
    }));
    res.json(usersWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Follow User
const followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow) {
            return res.status(404).json({ message: "User not found" });
        }

        if (currentUser.following.includes(userToFollow._id)) {
            return res.status(400).json({ message: "Already following this user" });
        }

        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);

        await currentUser.save();
        await userToFollow.save();

        res.json({ message: "User followed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Unfollow User
const unfollowUser = async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToUnfollow) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!currentUser.following.includes(userToUnfollow._id)) {
            return res.status(400).json({ message: "You are not following this user" });
        }

        currentUser.following = currentUser.following.filter(id => id.toString() !== userToUnfollow._id.toString());
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUser._id.toString());

        await currentUser.save();
        await userToUnfollow.save();

        res.json({ message: "User unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select("-password")
        .populate("followers", "username email")
        .populate("following", "username email");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Fetch tracks uploaded by the user
      const tracks = await Track.find({ uploadedBy: user._id });
  
      // Parse metadata for each track to extract thumbnails
      const tracksWithThumbnails = await Promise.all(
        tracks.map(async (track) => {
          const filePath = path.join(__dirname, "..", track.filePath); // Adjust path as needed
          console.log("Parsing file for thumbnail:", filePath);
          try {
            const metadata = await musicMetadata.parseFile(filePath);
            const picture = metadata.common.picture?.[0];
            let thumbnailUrl = null;
            if (picture) {
              thumbnailUrl = `data:${picture.format};base64,${Buffer.from(picture.data).toString("base64")}`;
            }
            return {
              _id: track._id,
              title: track.title,
              uploadedBy: track.uploadedBy,
              filePath: track.filePath,
              likes: track.likes,
              thumbnailUrl, // Add thumbnail to each track
            };
          } catch (err) {
            console.error(`Failed to parse metadata for track ${track._id}:`, err.message);
            return {
              _id: track._id,
              title: track.title,
              uploadedBy: track.uploadedBy,
              filePath: track.filePath,
              likes: track.likes,
              thumbnailUrl: null, // Fallback if metadata parsing fails
            };
          }
        })
      );
  
      res.json({
        username: user.username,
        email: user.email,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        followers: user.followers,
        following: user.following,
        uploadedTracks: tracksWithThumbnails,
        isFollowing: user.followers.some((f) => f._id.toString() === req.user.id.toString()), // Add isFollowing
      });
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

module.exports = { followUser, unfollowUser, getUserProfile, getAllUsers };
