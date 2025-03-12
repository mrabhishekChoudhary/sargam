const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const trackRoutes = require("./routes/trackRoutes");
const commentRoutes = require("./routes/commentRoutes");
const { getAllUsers } = require("./controllers/userController");
const protect = require("./middlewares/authMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Specific route for all users *before* dynamic routes
app.get("/api/users/All", protect, getAllUsers);

// Mount other routes
app.use("/api/users", userRoutes); // This includes /:id, so it comes after /All
app.use("/api/tracks", trackRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));