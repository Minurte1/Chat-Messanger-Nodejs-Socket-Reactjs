const mongoose = require("mongoose");

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

module.exports = mongoose;
