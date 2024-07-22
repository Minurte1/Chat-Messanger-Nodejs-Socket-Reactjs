const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("./config/db");
const IdVideo = require("./models/CallVideo");
const app = express();
const server = http.Server(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const CallMRoutes = require("./routes/VideoCall");
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(function (req, res, next) {
  req.io = io;
  next();
});
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/messages", CallMRoutes);
app.get("/", (req, res) => {
  res.send("hello");
});

io.on("connection", (socket) => {
  console.log("check me =>", socket.id);
  socket.emit("me", socket.id);
  const idVideoMe = socket.id;

  socket.on("idUserdatabse", async (data) => {
    const username_video = data;
    console.log("Received customEvent with myVariable:", username_video);

    try {
      const updateResult = await IdVideo.findOneAndUpdate(
        { username_video },
        { idVideoMe },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (updateResult) {
        console.log("Upserted idVideo to database", updateResult);
      }
    } catch (error) {
      console.error("Error upserting idVideo:", error.message);
    }
  });

  socket.on("disconnection", async (userId) => {
    console.log(`User ${userId} disconnected`);
    try {
      const deletedVideo = await IdVideo.findOneAndDelete({
        username_video: userId,
      });

      if (deletedVideo) {
        console.log(`Deleted video with username_video: ${userId}`);
      } else {
        console.log(`No video found with username_video: ${userId}`);
      }

      socket.broadcast.emit("callEnded");
    } catch (error) {
      console.error("Error finding and deleting video:", error.message);
    }
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = {
  io: io,
  server: server,
};
