const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const User = require("../models/user");

router.post("/addMessageToConversation", async (req, res) => {
  try {
    const { senderUserId, content, conversationId } = req.body;
    const user = await User.findById(senderUserId);
    if (!user) {
      return res.status(404).send("Người gửi không tồn tại.");
    }
    const newMessage = new Message({
      name: user.username,
      message: content,
    });
    await newMessage.save();
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).send("Cuộc trò chuyện không tồn tại.");
    }
    conversation.messages.push(newMessage._id);
    await conversation.save();
    const io = req.io;
    io.emit("message", { messageNe: newMessage });
    res.json({ messageNe: newMessage });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// router.post("/addMessageToConversation", async (req, res) => {
//   console.log(req.body.conversationId);
//   try {
//     // Lấy thông tin về người gửi tin nhắn và nội dung tin nhắn từ request body
//     const { senderUserId, content, conversationId } = req.body;
//     console.log(content);
//     // Tìm người dùng trong bảng user dựa trên senderUserId
//     const user = await User.findById(senderUserId);

//     // Kiểm tra xem người dùng có tồn tại hay không
//     if (!user) {
//       return res.status(404).send("Người gửi không tồn tại.");
//     }

//     // Lấy tên của người gửi từ kết quả tìm kiếm
//     const senderUserName = user.username;

//     // Tạo một tin nhắn mới từ thông tin về người gửi, tên người gửi và nội dung tin nhắn
//     const newMessage = new Message({
//       name: senderUserName,
//       // Gán tên người gửi vào trường senderName của tin nhắn
//       message: content,
//     });
//     if (!req.body.conversationId) {
//       return res.status(400).send("conversationId không được truyền.");
//     }

//     if (typeof req.body.conversationId !== "string") {
//       return res.status(400).send("conversationId phải là một chuỗi.");
//     }

//     // Tiếp tục xử lý khi conversationId hợp lệ

//     // Lưu tin nhắn mới vào cơ sở dữ liệu
//     try {
//       await newMessage.save();
//       console.log("New message saved:", newMessage);
//     } catch (err) {
//       console.error("Error saving message:", err);
//       // Handle the error appropriately
//     }
//     // Lấy cuộc trò chuyện từ cơ sở dữ liệu dựa trên conversationId
//     let conversation = await Conversation.findById(conversationId);
//     // console.log("check conversation", conversation);
//     // Kiểm tra xem cuộc trò chuyện có tồn tại hay không
//     if (!conversation) {
//       return res.status(404).send("Cuộc trò chuyện không tồn tại.");
//     }

//     // Thêm ID của tin nhắn mới vào mảng tin nhắn của cuộc trò chuyện tương ứng
//     conversation.messages.push(newMessage._id);

//     // Lưu lại cuộc trò chuyện sau khi đã thêm tin nhắn mới
//     await conversation.save();
//     console.log("newMessage", newMessage);
//     io.emit("message", { messageNe: newMessage });
//     // Phản hồi với mã trạng thái 200 để cho biết quá trình thêm tin nhắn vào cuộc trò chuyện đã hoàn tất
//     res.json({ messageNe: newMessage });
//   } catch (err) {
//     console.error(err);
//     // Phản hồi với mã trạng thái 500 để cho biết có lỗi xảy ra
//     res.sendStatus(500);
//   }
// });
router.post("/getMessages", async (req, res) => {
  try {
    const { conversationId } = req.body;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const messages = await Message.find({
      _id: { $in: conversation.messages },
    });
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find({});
    res.send(messages);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
