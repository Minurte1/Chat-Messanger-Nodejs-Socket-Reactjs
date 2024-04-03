import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";

const ENDPOINT = "http://localhost:3001"; // Địa chỉ của server Node.js

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMess, setinputMess] = useState("");
  const [inputUser, setinputUser] = useState("");
  const socket = socketIOClient(ENDPOINT);

  useEffect(() => {
    // Lấy danh sách tin nhắn từ server khi component được tải
    fetchMessages();

    // Lắng nghe sự kiện "message" từ server
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Xóa lắng nghe khi component unmount
      socket.disconnect();
    };
  }, []);
  // Chỉ chạy một lần sau khi component được render

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${ENDPOINT}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = (event) => {
    // Gửi tin nhắn mới lên server

    const newMessage = { name: inputUser, message: inputMess };
    axios
      .post(`${ENDPOINT}/messages`, newMessage)
      .then(() => {
        setinputMess(""); // Xóa input sau khi gửi
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div>
      <h1>Realtime Chat App</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.name}: </strong>
            {message.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={inputUser}
          onChange={(e) => setinputUser(e.target.value)}
        />
        <input
          type="text"
          value={inputMess}
          onChange={(e) => setinputMess(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
