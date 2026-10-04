const express = require("express");
const Poll = require("../models/Poll");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/polls - create a new poll (must be logged in)
router.post("/", auth, async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "A question and at least 2 options are required" });
    }

    const poll = await Poll.create({
      question,
      options: options.map((text) => ({ text, votes: 0 })),
      createdBy: req.userId,
    });

    res.status(201).json({ poll });
  } catch (err) {
    res.status(500).json({ message: "Failed to create poll", error: err.message });
  }
});

// GET /api/polls - list all polls
router.get("/", async (req, res) => {
  try {
    const polls = await Poll.find().populate("createdBy", "name").sort({ createdAt: -1 });
    res.json({ polls });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch polls", error: err.message });
  }
});

// GET /api/polls/:id - single poll detail
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate("createdBy", "name");
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    res.json({ poll });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch poll", error: err.message });
  }
});

// POST /api/polls/:id/vote - vote on an option, rejects a second vote from the same user
router.post("/:id/vote", auth, async (req, res) => {
  try {
    const { optionId } = req.body;
    if (!optionId) return res.status(400).json({ message: "optionId is required" });

    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // Check-before-update: has this user already voted on this poll?
    const alreadyVoted = poll.votedUsers.some((u) => String(u) === req.userId);
    if (alreadyVoted) {
      return res.status(409).json({ message: "You have already voted on this poll" });
    }

    const option = poll.options.id(optionId);
    if (!option) return res.status(404).json({ message: "Option not found" });

    option.votes += 1;
    poll.votedUsers.push(req.userId);
    await poll.save();

    res.json({ poll });
  } catch (err) {
    res.status(500).json({ message: "Failed to register vote", error: err.message });
  }
});

module.exports = router;
