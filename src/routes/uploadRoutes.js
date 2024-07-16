const express = require("express");
const multer = require("multer");
const User = require("../models/user");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ".png");
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const userId = req.body.idValue;
  const avatarFileName = req.file.filename;
  console.log(userId);
  console.log(avatarFileName);
  if (!userId || !avatarFileName) {
    return res
      .status(400)
      .json({ message: "Invalid userId or avatarFileName" });
  }
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { avt: avatarFileName } },
      { new: true, upsert: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      fileName: req.file.filename,
      filePath: `/src/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
