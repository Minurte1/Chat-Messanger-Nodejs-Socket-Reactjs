const express = require("express");
const router = express.Router();
const CallVideo = require("../models/CallVideo");
router.post("/call", async (req, res) => {
  try {
    console.log(req.body);
    const id_Friend = req.body.id_Friend;

    // Tìm kiếm với điều kiện cụ thể
    const user = await CallVideo.findOne({ username_video: id_Friend });

    // Kiểm tra xem user có tồn tại hay không
    if (!user) {
      return res.status(404).json({ message: "User not found", EC: 1 });
    }

    console.log("user", user.idVideoMe);
    res
      .status(200)
      .json({
        message: "Lấy ID của họ thành công",
        EC: 0,
        idVideoMe: user.idVideoMe,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
