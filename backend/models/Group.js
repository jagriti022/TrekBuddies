const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the group
  monument: { type: String, required: true }, // Monument associated with the group
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of member references
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the group was created
});

module.exports = mongoose.model("Group", groupSchema);
