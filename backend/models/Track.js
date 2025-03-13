const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Ensure "User" model exists
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    language: { 
      type: String, 
      enum: ["Hindi", "English", "Punjabi", "Bhojpuri", "Haryanvi"], 
      required: true 
    }, // Adding language field with options
  },
  { timestamps: true }
);

module.exports = mongoose.model("Track", trackSchema);
