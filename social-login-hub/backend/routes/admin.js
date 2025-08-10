const express = require("express");
const router = express.Router();
const LoginData = require("../models/LoginData");

// GET login-data (same as before)
router.get("/login-data", async (req, res) => {
  try {
    let { page = 1, limit = 20, search = "", platform = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
      ];
    }
    if (platform) {
      filter.platform = platform.toLowerCase();
    }

    const totalEntries = await LoginData.countDocuments(filter);
    const totalPages = Math.ceil(totalEntries / limit);
    const currentPage = Math.min(Math.max(page, 1), totalPages || 1);

    const data = await LoginData.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ data, totalPages, totalEntries, currentPage });
  } catch (error) {
    console.error("Admin fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE entry by ID
router.delete("/login-data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await LoginData.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
