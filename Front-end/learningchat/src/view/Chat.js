import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Chat.css";
import { set } from "mongoose";
const ENDPOINT = "http://localhost:3001"; // Địa chỉ của server Node.js

const Chat = () => {
  const [inputMess, setinputMess] = useState("");
  const [inputUser, setinputUser] = useState("");
  const [listUser, setListUser] = useState([]);
  const [NguoiMaBanMuonNhanTin, setNguoiMaBanMuonNhanTin] = useState();

  const [IdCoversation, setIdCoversation] = useState("");

  const id = useParams();

  const idValue = Object.values(id)[0];

  const [TinNhan, setTinNhan] = useState([]);

  useEffect(() => {
    // Thiết lập kết nối với server socket
    const socket = io(ENDPOINT);

    // Lắng nghe sự kiện "message" từ server
    socket.on("message", (data) => {
      // Trích xuất tin nhắn từ dữ liệu nhận được
      const newMessage = data.messageNe;
      // Cập nhật state TinNhan bằng cách thêm tin nhắn mới vào mảng tin nhắn đã có
      setTinNhan((prevMessages) => [...prevMessages, newMessage]);
    });

    // Ngắt kết nối khi component unmount
    return () => {
      socket.disconnect();
    };
  }, []);
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
  const SendMessNe = async () => {
    try {
      // Gửi yêu cầu POST đến server
      const response = await axios.post(
        "http://localhost:3001/api/addMessageToConversation",
        {
          senderUserId: idValue, // ID của người gửi tin nhắn
          content: inputMess, // Nội dung của tin nhắn
          conversationId: IdCoversation, // ID của cuộc trò chuyện
        }
      );
      console.log("id", idValue, "mess", inputMess, "coverid=>", IdCoversation);
      console.log("backend gui len ne =>", response.data.messageNe.message);

      // Nếu yêu cầu thành công, in ra thông báo "Gửi tin nhắn thành công"
      console.log("Gửi tin nhắn thành công");

      setinputMess("");
      const responseMess = await axios.post(
        "http://localhost:3001/api/getMessages",
        {
          conversationId: IdCoversation, // Truyền id của user đó xuống server
        }
      );
      setTinNhan(responseMess.data);

      // Nếu bạn cần xử lý dữ liệu trả về từ server, bạn có thể làm ở đây
      // Ví dụ: const data = response.data;
    } catch (error) {
      // Nếu có lỗi xảy ra, in ra thông báo lỗi
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };
  const sendMessage = () => {
    alert("oke");
    const newMessage = { IdUserSend: idValue, message: inputMess };

    axios
      .post(`${ENDPOINT}/messages`, newMessage)
      .then(() => {
        setinputMess("");
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };
  const handlePressEnter = async (event) => {
    if (event.charCode == 13) {
      await SendMessNe();
      event.preventDefault();
    }
  };
  const handleUserIb = async (user) => {
    setNguoiMaBanMuonNhanTin(Object.values(user)[2]);

    try {
      // Gửi yêu cầu POST đến server
      const response = await axios.post(
        "http://localhost:3001/api/createConversation",
        {
          participants: [user._id, idValue], // Truyền id của user đó xuống server
        }
      );
      setIdCoversation(response.data.conversationId);
      const a = response.data.conversationId;
      console.log("id conver =>", a);
      console.log("id conver =>", IdCoversation);
      const responseMess = await axios.post(
        "http://localhost:3001/api/getMessages",
        {
          conversationId: IdCoversation, // Truyền id của user đó xuống server
        }
      );
      setTinNhan(responseMess.data);
      console.log("check tin nhắn =>", responseMess);
      // Nếu yêu cầu thành công, in ra thông báo "Tạo cuộc trò chuyện thành công"
      console.log("Tạo cuộc trò chuyện thành công");

      // Nếu bạn cần xử lý dữ liệu trả về từ server, bạn có thể làm ở đây
      // Ví dụ: const data = response.data;
    } catch (error) {
      // Nếu có lỗi xảy ra, in ra thông báo lỗi
      console.error("Lỗi khi tạo cuộc trò chuyện:", error);
    }
  };

  // Lấy giá trị của thuộc tính không rõ tên
  console.log(TinNhan);
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
            {listUser.map(
              (user, index) =>
                user &&
                user._id !== idValue && (
                  <div
                    key={index}
                    className="container-chat_Doatchat-TinNhan"
                    onClick={() => handleUserIb(user)}
                  >
                    <div className="container-chat_Doatchat-TinNhan">
                      <img
                        className="Doatchat-TinNhan-Avt"
                        src={require("../public/image/avt.jpg")}
                      />
                      <div className="Doatchat-TinNhan-name">
                        <p className="name">{user.username}</p>
                        <div className="MessAndTime">
                          <p className="mess">Phúc ơiiiii </p>{" "}
                          <span className="time">4 phút</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )}
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
                    <p className="NoiDungChat-Navbar-1name">
                      {NguoiMaBanMuonNhanTin}
                    </p>
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
            {/* Tin nhắn được render ở đây */}
            <div className="NoiDungChat-Body">
              <div className="NoiDungChat-Body">
                <div
                  className="NoiDungChat-Body-NoiDungChat"
                  id="messageContainer"
                >
                  {/* Lặp qua mảng messages và render mỗi tin nhắn */}
                  {TinNhan.map((message) => (
                    <div key={message._id} className="message">
                      <p>
                        <strong>{message.name}:</strong> {message.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nơi nhập tin nhắn */}
              <div className="NoiDungChat-thanhChat">
                <div className="NoiDungChat-thanhChat-1  margin-left-20px">
                  <i class="fa-solid fa-circle-plus logoinput"></i>
                </div>
                <div className="NoiDungChat-thanhChat-1 margin5px">
                  <i class="fa-regular fa-image  logoinput"></i>
                </div>
                <div className="NoiDungChat-thanhChat-1">
                  <i class="fa-solid fa-face-smile logoinput margin-right5px"></i>
                </div>
                <div className="NoiDungChat-thanhChat-1">
                  <i class="fa-solid fa-gift logoinput"></i>
                </div>
                <div className="NoiDungChat-thanhChat-Input">
                  <input
                    className="NoiDungChat-thanhChat-Input-1"
                    placeholder="Aa"
                    type="text"
                    value={inputMess}
                    onChange={(e) => setinputMess(e.target.value)}
                    onKeyPress={(event) => handlePressEnter(event)}
                  ></input>
                </div>
                <div className="NoiDungChat-thanhChat-3">
                  <img
                    className="CavoiCute"
                    alt="🐳"
                    src="https://static.xx.fbcdn.net/images/emoji.php/v9/tde/1.5/20/1f433.png"
                  ></img>
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
