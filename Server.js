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
var Message = mongoose.model("Message", {
  name: String,
  message: String,
});

var dbUrl = "mongodb://localhost:27017/chat";

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

app.post("/messages", (req, res) => {
  var message = new Message(req.body);
  message.save((err) => {
    if (err) sendStatus(500);
    io.emit("message", req.body);
    res.sendStatus(200);
  });
});

io.on("connection", (socket) => {
  console.log("a user connected");

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

var server = http.listen(3001, () => {
  console.log("server is running on port", server.address().port);
});
