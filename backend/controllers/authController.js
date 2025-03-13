const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await authService.registerUser(username, email, password);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ _id: user._id, username: user.username, email: user.email, token });
  } catch (error) {
    console.error("Error in register:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const token = await authService.loginUser(email, password);
    res.json({ token });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = { register, login };