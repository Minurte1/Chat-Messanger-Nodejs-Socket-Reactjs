const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation");
const User = require("../models/user");

router.post("/createConversation", async (req, res) => {
  try {
    const { participants } = req.body;
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants },
    });
    if (existingConversation) {
      return res.status(200).json({ conversationId: existingConversation._id });
    }
    const newConversation = new Conversation({ participants, messages: [] });
    await newConversation.save();
    res.status(200).json({ conversationId: newConversation._id });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.post("/conversations", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const conversations = await Conversation.find({ participants: userId });
    res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
