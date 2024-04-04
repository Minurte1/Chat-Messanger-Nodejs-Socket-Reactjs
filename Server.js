var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var http = require("http").Server(app);
var io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
var mongoose = require("mongoose");
const cors = require("cors");
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// ---------------------------------------------------------------------------------------------------
const dbUrl = "mongodb://localhost:27017/chat";
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.error("mongodb connection error:", err);
  });
const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});
const Conversation = mongoose.model("Conversation", conversationSchema);
const userSchema = new mongoose.Schema({
  // Các trường khác của user
  email: String,
  username: String,
  password: String,
  phone: String,

  conversations: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  ],
});

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
});

const User = mongoose.model("User", userSchema);
var Message = mongoose.model("Message", {
  name: String,
  message: String,
});
app.post("/api/createUser", async (req, res) => {
  try {
    const newUser = new User({
      email: req.body.email,
      phone: req.body.phone,
      username: req.body.username,
      password: req.body.password,
    });
    console.log("Check User", req.body);
    // Lưu user mới vào cơ sở dữ liệu
    await newUser.save();

    // Phản hồi với mã trạng thái 200 để cho biết tạo user thành công
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    // Phản hồi với mã trạng thái 500 để cho biết có lỗi xảy ra
    res.sendStatus(500);
  }
});

// Tạo một endpoint để lấy danh sách các cuộc trò chuyện mà một người dùng đã tham gia
app.get("/api/conversations/:userId", async (req, res) => {
  try {
    // Lấy ID của người dùng từ request parameters
    const userId = req.params.userId;
    console.log(userId);
    // Tìm kiếm người dùng trong cơ sở dữ liệu bằng ID
    const user = await User.findById(userId);

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Lấy danh sách các cuộc trò chuyện mà người dùng đã tham gia
    const conversations = await Conversation.find({ participants: userId });
    console.log("Trả conversations =>", conversations);
    // Trả về danh sách các cuộc trò chuyện
    res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    // Trả về lỗi nếu có lỗi xảy ra trong quá trình xử lý
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log("Hello login");

    console.log("email =>", req.body);
    const email = req.body.valueLogin;
    const password = req.body.password;
    // Tìm kiếm người dùng trong cơ sở dữ liệu dựa trên email`
    const user = await User.findOne({ email, password });

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res.status(404).json({ message: "User not found", EC: 1 });
    }

    // Kiểm tra mật khẩu
    console.log("User đăng nhập thành công !!");
    // Phản hồi với mã trạng thái 200 và thông tin người dùng (ví dụ: token JWT) để đăng nhập thành công
    res.status(200).json({ message: "Login successful", EC: 0, _id: user });
  } catch (err) {
    console.error(err);
    // Phản hồi với mã trạng thái 500 để cho biết có lỗi xảy ra
    res.status(500).json({ message: "Internal server error" });
  }
});

// Tạo một user mới
//Click vào để bắt đầu nhắn với 1nguoi mới
// Tạo một conversation mới`
app.post("/api/createConversation", async (req, res) => {
  try {
    const { participants } = req.body;

    const newConversation = new Conversation({
      participants: participants, // Lấy thông tin về các người tham gia cuộc trò chuyện từ request body
      messages: [],
    });

    // Lưu cuộc trò chuyện mới vào cơ sở dữ liệu
    await newConversation.save();

    // Phản hồi với mã trạng thái 200 để cho biết tạo cuộc trò chuyện thành công
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    // Phản hồi với mã trạng thái 500 để cho biết có lỗi xảy ra
    res.sendStatus(500);
  }
});
//Đang nhắn
// Tạo một tin nhắn mới và thêm vào conversation
app.post("/api/addMessageToConversation", async (req, res) => {
  try {
    // Lấy thông tin về người gửi tin nhắn và nội dung tin nhắn từ request body
    const { senderUserId, content, conversationId } = req.body;

    // Tạo một tin nhắn mới từ thông tin về người gửi và nội dung tin nhắn
    const newMessage = new Message({
      name: senderUserId,
      message: content,
    });

    // Lưu tin nhắn mới vào cơ sở dữ liệu
    await newMessage.save();

    // Lấy cuộc trò chuyện từ cơ sở dữ liệu dựa trên conversationId
    const conversation = await Conversation.findById(conversationId);

    // Thêm ID của tin nhắn mới vào mảng tin nhắn của cuộc trò chuyện tương ứng
    conversation.messages.push(newMessage._id);

    // Lưu lại cuộc trò chuyện sau khi đã thêm tin nhắn mới
    await conversation.save();

    // Phản hồi với mã trạng thái 200 để cho biết quá trình thêm tin nhắn vào cuộc trò chuyện đã hoàn tất
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    // Phản hồi với mã trạng thái 500 để cho biết có lỗi xảy ra
    res.sendStatus(500);
  }
});

// API để lấy tin nhắn dựa trên ID của cuộc trò chuyện
app.get("/api/getMessages/:conversationId", async (req, res) => {
  try {
    // Lấy ID của cuộc trò chuyện từ request parameters
    const conversationId = req.params.conversationId;

    // Tìm kiếm cuộc trò chuyện trong cơ sở dữ liệu bằng ID
    const conversation = await Conversation.findById(conversationId);

    // Kiểm tra xem cuộc trò chuyện có tồn tại không
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Lấy danh sách tin nhắn trong cuộc trò chuyện
    const messages = await Message.find({
      _id: { $in: conversation.messages },
    });

    // Trả về danh sách tin nhắn
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    // Trả về lỗi nếu có lỗi xảy ra trong quá trình xử lý
    res.status(500).json({ message: "Internal server error" });
  }
});

// app.get("/messages", (req, res) => {
//   Message.find({}, (err, messages) => {
//     res.send(messages);
//   });
// });

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find({});
    res.send(messages);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/messages", async (req, res) => {
  try {
    var message = new Message(req.body);
    await message.save();
    io.emit("message", req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

io.on("connection", (socket) => {
  // console.log("a user connected");

  // Lắng nghe sự kiện "message" từ client
  socket.on("message", async (message) => {
    console.log("Received message from client:", message);
    // Xử lý tin nhắn ở đây, ví dụ: lưu vào cơ sở dữ liệu, gửi lại cho các client khác, vv.
    try {
      // Tạo một bản ghi mới của Message và lưu vào MongoDB
      const newMessage = new Message(message);
      await newMessage.save();
      console.log("Message saved to MongoDB:", newMessage);
    } catch (error) {
      console.error("Error saving message to MongoDB:", error);
    }
  });
});

var server = http.listen(3001, () => {
  console.log("server is running on port", server.address().port);
});
