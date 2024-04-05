import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Chat.css";
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
    // <div>
    //   <h3>All User</h3>
    //   <div>
    //     {listUser.map((user, index) => (
    //       <div key={index}>
    //         <strong>{user.username}: </strong>
    //       </div>
    //     ))}
    //   </div>
    //   <h1>Realtime Chat App</h1>
    //   <div>
    //     {messages.map((message, index) => (
    //       <div key={index}>
    //         <strong>{message.name}: </strong>
    //         {message.message}
    //       </div>
    //     ))}
    //   </div>
    //   <div>
    //     <input
    //       type="text"
    //       value={inputUser}
    //       onChange={(e) => setinputUser(e.target.value)}
    //     />
    //     <input
    //       type="text"
    //       value={inputMess}
    //       onChange={(e) => setinputMess(e.target.value)}
    //     />
    //     <button onClick={sendMessage}>Send</button>
    //   </div>
    // </div>

    <>
      <div className="container-chat">
        <div className="container-chat_Navbar">
          <div className="container-chat_Navbar-1">
            <img
              className="logofb"
              src={require("../public/image/facebook.png")}
            />
            <div className="container-chat_Navbar-1_InputSearch">
              {" "}
              <i class="fa-solid fa-magnifying-glass"></i>
              <span>Tìm kiếm trên facebook</span>
            </div>
          </div>
          <div className="container-chat_Navbar-2">
            <i class="fa-solid fa-house"></i>
            <i class="fa-solid fa-user-group"></i>
            <i class="fa-solid fa-gamepad"></i>
            <i class="fa-solid fa-users"></i>
          </div>
          <div className="container-chat_Navbar-3">
            <i class="fa-solid fa-bell"></i>
            <img className="logoavt" src={require("../public/image/avt.jpg")} />
          </div>
        </div>
        <div className="container-bodyChat">
          <div className="Doatchat">
            <div className="Doatchat-tieude">
              <p>Đoạn chat</p>
              <div className="Doatchat-Ellipsis">
                <i class="fa-solid fa-ellipsis"></i>
              </div>
              <div className="Doatchat-fa-pen-to-square">
                <i class="fa-solid fa-pen-to-square"></i>
              </div>
            </div>
            <div className="container-chat_Doatchat_InputSearch">
              {" "}
              <i class="fa-solid fa-magnifying-glass"></i>
              <span>Tìm kiếm trên Messenger</span>
            </div>
            <div className="container-chat_Doatchat-ChucNang">
              <div className="container-chat_Doatchat-ChucNang-1">
                {" "}
                <p>Hộp thư</p>
              </div>

              <div className="container-chat_Doatchat-ChucNang-2">
                {" "}
                <p>Cộng đồng</p>
              </div>
            </div>
            {/* Render dữ liệu */}
            <div className="container-chat_Doatchat-TinNhan">
              <div className="container-chat_Doatchat-TinNhan">
                <img
                  className="Doatchat-TinNhan-Avt"
                  src={require("../public/image/avt.jpg")}
                />
                <div className="Doatchat-TinNhan-name">
                  <p className="name">Hoàng Phúc</p>
                  <div className="MessAndTime">
                    {" "}
                    <p className="mess">Phúc ơiiiii </p>{" "}
                    <span className="time">4 phút</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="container-chat_Doatchat-TinNhan">
              <div className="container-chat_Doatchat-TinNhan">
                <img
                  className="Doatchat-TinNhan-Avt"
                  src={require("../public/image/avt.jpg")}
                />
                <div className="Doatchat-TinNhan-name">
                  <p className="name">Hoàng Phúc</p>
                  <div className="MessAndTime">
                    {" "}
                    <p className="mess">Phúc ơiiiii </p>{" "}
                    <span className="time">4 phút</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-chat_Doatchat-TinNhan">
              <div className="container-chat_Doatchat-TinNhan">
                <img
                  className="Doatchat-TinNhan-Avt"
                  src={require("../public/image/avt.jpg")}
                />
                <div className="Doatchat-TinNhan-name">
                  <p className="name">Hoàng Phúc</p>
                  <div className="MessAndTime">
                    {" "}
                    <p className="mess">Phúc ơiiiii </p>{" "}
                    <span className="time">4 phút</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="NoiDungChat">
            <div className="NoiDungChat-Navbar">
              <div className="NoiDungChat-Navbar-1">
                <div className="NoiDungChat-Navbar-1-TinNhan">
                  <img
                    className="NoiDungChat-Navbar-1-TinNhan-Avt"
                    src={require("../public/image/avt.jpg")}
                  />
                  <div className="NoiDungChat-Navbar-1-TinNhan-name">
                    <p className="NoiDungChat-Navbar-1name">Hoàng Phúc</p>
                    <div className="NoiDungChat-Navbar-1MessAndTime">
                      {" "}
                      <span className="NoiDungChat-Navbar-1time">
                        Hoạt động 4 phút trước
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="NoiDungChat-Navbar-2"></div>
              <div className="NoiDungChat-Navbar-3">
                <div className="NoiDungChat-Navbar-3-phone">
                  <i class="fa-solid fa-phone"></i>
                </div>
                <div className="NoiDungChat-Navbar-3-phone margin10px">
                  <i class="fa-solid fa-video"></i>
                </div>
                <div className="NoiDungChat-Navbar-3-phone">
                  <i class="fa-solid fa-circle-info"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="InfoUserChat"></div>
        </div>
      </div>
    </>
  );
};

export default Chat;
