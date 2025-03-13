const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userDAO = require("../dao/userDAO");

const registerUser = async (username, email, password) => {
  try {
    const existingUser = await userDAO.findUserByEmail(email);
    if (existingUser) {
      console.log(`User with email ${email} already exists`);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed password for ${email}: ${hashedPassword}`);
    const user = await userDAO.createUser({ username, email, password: hashedPassword });
    console.log(`User created: ${JSON.stringify(user)}`);
    return user;
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    throw error; // Ensure the error propagates
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await userDAO.findUserByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    throw error;
  }
};

module.exports = { registerUser, loginUser };