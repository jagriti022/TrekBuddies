const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const User = require("../models/User");

// Route to create a new group
router.post("/create", async (req, res) => {
  const { name, monument } = req.body;

  // Check if required fields are provided
  if (!name || !monument) {
    return res.status(400).json({ message: "Name and monument are required." });
  }

  // Create a new group instance
  const group = new Group({ name, monument });

  try {
    // Save the new group to the database
    const newGroup = await group.save();
    res.status(201).json(newGroup);
  } catch (err) {
    // Handle errors during group creation
    res.status(500).json({ message: err.message });
  }
});

// Route to join a group by name and monument
router.post("/join", async (req, res) => {
  const { name, monument, userId } = req.body;

  // Check if required fields are provided
  if (!name || !monument || !userId) {
    return res
      .status(400)
      .json({ message: "Group name, monument, and user ID are required." });
  }

  try {
    // Find the group by name and monument
    const group = await Group.findOne({ name, monument });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add the user to the group's members array if not already present
    if (!group.members.includes(user._id)) {
      group.members.push(user._id);
      await group.save();
    }

    res.json(group);
  } catch (err) {
    // Handle errors during the join process
    res.status(500).json({ error: err.message });
  }
});

// Route to list all groups
router.get("/list", async (req, res) => {
  try {
    // Fetch all groups from the database
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    // Handle errors during fetching of groups
    res.status(500).json({ message: err.message });
  }
});

router.post("/ggd/:id", async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = Group.findById(groupId);
    res.status(400).json({ group: group });
  } catch (err) {}
});

// Route to search for groups by name or monument
router.get("/search", async (req, res) => {
  const { keyword } = req.query;

  // Check if keyword is provided
  if (!keyword) {
    return res
      .status(400)
      .json({ message: "Keyword is required for searching." });
  }

  try {
    // Find groups that match the keyword in name or monument
    const groups = await Group.find({
      $or: [
        { name: new RegExp(keyword, "i") },
        { monument: new RegExp(keyword, "i") },
      ],
    });
    res.json(groups);
  } catch (err) {
    // Handle errors during the search process
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
