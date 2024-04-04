import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";

const ENDPOINT = "http://localhost:3001"; // Địa chỉ của server Node.js

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMess, setinputMess] = useState("");
  const [inputUser, setinputUser] = useState("");
  const [listUser, setListUser] = useState([]);
  const socket = socketIOClient(ENDPOINT);
  const id = useParams();
  console.log("check id paramaer =>", id);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${ENDPOINT}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages(); // Gọi hàm lấy tin nhắn khi component được tạo

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    const fetchListUser = async () => {
      try {
        const response = await axios.get(`${ENDPOINT}/allusers`);
        setListUser(response.data);
      } catch (error) {
        console.error("Error fetching list of users:", error);
      }
    };

    fetchListUser(); // Gọi hàm lấy danh sách người dùng khi component được tạo
  }, []);

  const sendMessage = () => {
    const newMessage = { name: inputUser, message: inputMess };
    axios
      .post(`${ENDPOINT}/messages`, newMessage)
      .then(() => {
        setinputMess("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };
  console.log(listUser);
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
};

export default Chat;
