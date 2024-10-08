import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Chat.css";
import { useNavigate } from "react-router-dom";
import { set } from "mongoose";
import { toast } from "react-toastify";
import { SocketContext } from "../Context";
import Notifications from "../componentStream/Notifications";
import Option from "../componentStream/Option";
import VideoPlayer from "../componentStream/VideoPlayer";
const ENDPOINT = "http://localhost:3001"; // Địa chỉ của server Node.js
const socket = io(ENDPOINT);
const Chat = () => {
  const navigate = useNavigate();
  const { handleCallFriend } = useContext(SocketContext);
  const [inputMess, setinputMess] = useState("");
  const [inputUser, setinputUser] = useState("");
  const [listUser, setListUser] = useState([]);
  const [NguoiMaBanMuonNhanTin, setNguoiMaBanMuonNhanTin] = useState();
  const [id_Friend, setId_Friend] = useState();
  const [IdCoversation, setIdCoversation] = useState("");

  const id = useParams();

  const idValue = Object.values(id)[0];

  // console.log("id of me", Object.values(id)[0]);
  const [TinNhan, setTinNhan] = useState([]);
  const [ShowMenuAvatar, setShowMenuAvatar] = useState(false);
  const handleShowMenuAvatar = () => {
    setShowMenuAvatar(!ShowMenuAvatar);
  };

  useEffect(() => {
    // Thiết lập kết nối với server socket

    socket.emit("idUserdatabse", idValue);
    console.log("check Iduser", idValue);
    // Lắng nghe sự kiện "message" từ server
    socket.on("message", (data) => {
      console.log("message SV +>", data);
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
  const [ImageOfMe, setImageOfMe] = useState();
  const [NameOfMe, setNameOfMe] = useState();
  // console.log("imageofme=>", ImageOfMe);

  useEffect(() => {
    const fetchListUser = async () => {
      try {
        const response = await axios.get(`${ENDPOINT}/api/users/allusers`);
        // Lọc dữ liệu để chỉ lấy user có _id trùng với idValue
        const filteredUsers = response.data.filter(
          (user) => user._id === idValue
        );
        // Lưu danh sách người dùng đã lọc vào state
        setListUser(filteredUsers);
        // Nếu có user trong danh sách đã lọc, thì lấy ảnh của user đầu tiên và lưu vào state
        if (filteredUsers.length > 0) {
          setImageOfMe(filteredUsers[0].avt);
          setNameOfMe(filteredUsers[0].username);
        }
      } catch (error) {
        console.error("Error fetching list of users:", error);
      }
    };

    fetchListUser(); // Gọi hàm lấy danh sách người dùng khi component được tạo
  }, [idValue]); // Thêm idValue vào dependency array để useEffect được gọi lại khi idValue thay đổi

  useEffect(() => {
    const fetchListUser = async () => {
      try {
        const response = await axios.get(`${ENDPOINT}/api/users/allusers`);
        console.log("list user =>", response.data);
        setListUser(response.data);
      } catch (error) {
        console.error("Error fetching list of users:", error);
      }
    };

    fetchListUser(); // Gọi hàm lấy danh sách người dùng khi component được tạo
  }, []);
  const handleIconCaVoi = async () => {
    try {
      // Gửi yêu cầu POST đến server
      const response = await axios.post(
        "http://localhost:3001/api/messages/addMessageToConversation",
        {
          senderUserId: idValue, // ID của người gửi tin nhắn
          content: "🐳", // Nội dung của tin nhắn
          conversationId: IdCoversation, // ID của cuộc trò chuyện
        }
      );
      console.log("id", idValue, "mess", inputMess, "coverid=>", IdCoversation);
      console.log("backend gui len ne =>", response.data.messageNe.message);

      // Nếu yêu cầu thành công, in ra thông báo "Gửi tin nhắn thành công"
      console.log("Gửi tin nhắn thành công");

      setinputMess("");
      const responseMess = await axios.post(
        "http://localhost:3001/api/messages/getMessages",
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
  const SendMessNe = async () => {
    if (!inputMess) {
      return;
    }
    try {
      // Gửi yêu cầu POST đến server
      const response = await axios.post(
        "http://localhost:3001/api/messages/addMessageToConversation",
        {
          senderUserId: idValue, // ID của người gửi tin nhắn
          content: inputMess, // Nội dung của tin nhắn
          conversationId: IdCoversation, // ID của cuộc trò chuyện
        }
      );

      console.log("id", idValue, "mess", inputMess, "coverid=>", IdCoversation);
      console.log("backend gui len ne =>", response.data);

      // Nếu yêu cầu thành công, in ra thông báo "Gửi tin nhắn thành công"
      console.log("Gửi tin nhắn thành công");

      setinputMess("");
      const responseMess = await axios.post(
        "http://localhost:3001/api/messages/getMessages",
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

  const [ImageUserWantMess, setImageUserWantMess] = useState();

  const handleUserIb = async (user) => {
    setId_Friend(user._id);

    try {
      // Gửi yêu cầu POST đến server
      const response = await axios.post(
        "http://localhost:3001/api/conversations/createConversation",
        {
          participants: [user._id, idValue], // Truyền id của user đó xuống server
        }
      );
      setIdCoversation(response.data.conversationId);
      const a = response.data.conversationId;
      console.log("id conver =>", a);
      console.log("id conver =>", IdCoversation);
      const responseMess = await axios.post(
        "http://localhost:3001/api/messages/getMessages",
        {
          conversationId: IdCoversation, // Truyền id của user đó xuống server
        }
      );
      setTinNhan(responseMess.data);
      console.log("check tin nhắn =>", responseMess);
      // Nếu yêu cầu thành công, in ra thông báo "Tạo cuộc trò chuyện thành công"
      console.log("Tạo cuộc trò chuyện thành công");
      setNguoiMaBanMuonNhanTin(Object.values(user)[2]);

      setImageUserWantMess(Object.values(user)[7]);
      // Nếu bạn cần xử lý dữ liệu trả về từ server, bạn có thể làm ở đây
      // Ví dụ: const data = response.data;
    } catch (error) {
      // Nếu có lỗi xảy ra, in ra thông báo lỗi
      console.error("Lỗi khi tạo cuộc trò chuyện:", error);
    }
  };

  // Lấy giá trị của thuộc tính không rõ tên
  console.log(TinNhan);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Function to scroll to bottom
    const scrollToBottom = () => {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    };

    // Scroll to bottom when TinNhan changes
    scrollToBottom();
  }, [TinNhan]); // Run when TinNhan changes

  // .................CẬP NHẬT AVATAR..............................
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = async (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      // console.log("formdata =>", formData, "nguoisetabat", idValue);
      // console.log("check avta =>", selectedFile);
      formData.append("idValue", idValue);
      const response = await axios.post(
        "http://localhost:3001/api/upload/upload",
        formData,
        idValue,
        selectedFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("response data => ", response.data);
      toast.success("Thay đổi ảnh đại diện thành công");
      setImageOfMe(response.data.fileName);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };
  const handleLogout = () => {
    socket.emit("disconnection", idValue); // Gửi sự kiện disconnection với ID của người dùng
    navigate("/"); // Điều hướng về trang đăng nhập
  };
  // console.log("nguoima ban muon nhan tin =>", NguoiMaBanMuonNhanTin);
  return (
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
            <div className="container-chat_Navbar-3-avatar">
              {" "}
              <img
                onClick={handleShowMenuAvatar}
                className="logoavt"
                src={`http://localhost:3001/public/uploads/${ImageOfMe}`}
              />{" "}
              <i class="fa-solid fa-chevron-down"></i>
            </div>
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
                        src={`http://localhost:3001/public/uploads/${user.avt}`}
                        alt="User Avatar"
                      />
                      <div className="Doatchat-TinNhan-name">
                        <p className="name">{user.username}</p>
                        {/* <div className="MessAndTime">
                          <p className="mess">Phúc ơiiiii </p>{" "}
                          <span className="time">4 phút</span>
                        </div> */}
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
                    src={`http://localhost:3001/public/uploads/${ImageUserWantMess}`}
                  />
                  <div className="NoiDungChat-Navbar-1-TinNhan-name">
                    <p className="NoiDungChat-Navbar-1name">
                      {NguoiMaBanMuonNhanTin}
                    </p>
                    <div className="NoiDungChat-Navbar-1MessAndTime">
                      {" "}
                      {/* <span className="NoiDungChat-Navbar-1time">
                        Hoạt động 4 phút trước
                      </span> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="NoiDungChat-Navbar-2"></div>
              <div className="NoiDungChat-Navbar-3">
                <div className="NoiDungChat-Navbar-3-phone">
                  <i
                    class="fa-solid fa-phone"
                    onClick={() => handleCallFriend(id_Friend)}
                  ></i>
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
                  ref={chatContainerRef}
                  className="NoiDungChat-Body-NoiDungChat chat-container"
                  id="messageContainer"
                >
                  {/* Lặp qua mảng messages và render mỗi tin nhắn */}
                  {TinNhan.map((message) => (
                    <div key={message._id} className="message">
                      <p
                        className={`container-messs ${
                          message.name !== NguoiMaBanMuonNhanTin
                            ? "text-align-right justify-content-right"
                            : ""
                        }`}
                      >
                        <div className="container-messCha2">
                          {message.name !== NguoiMaBanMuonNhanTin && (
                            <div className="container-noidungtinnhan2 text-align-right">
                              <p className="noidungtinnhan2 ">
                                {message.message}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="container-messCha">
                          <img
                            className={`NoiDungChat-NoiDung-1-TinNhan-Avt ${
                              message.name === NguoiMaBanMuonNhanTin
                                ? "image-Avta"
                                : "display-none"
                            }`}
                            src={`http://localhost:3001/public/uploads/${ImageUserWantMess}`}
                          />

                          {message.name === NguoiMaBanMuonNhanTin && (
                            <div className="container-noidungtinnhan">
                              <p className="noidungtinnhan">
                                {message.message}
                              </p>
                            </div>
                          )}
                        </div>
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
                    onClick={handleIconCaVoi}
                    className="CavoiCute"
                    alt="🐳"
                    src="https://static.xx.fbcdn.net/images/emoji.php/v9/tde/1.5/20/1f433.png"
                  ></img>
                </div>
              </div>
            </div>
          </div>

          <div className="InfoUserChat ">
            {ShowMenuAvatar ? (
              <div className="InfoUserChat-ShowMenu">
                <div className="InfoUserChat-ShowMenu-Con">
                  <div className="InfoUserChat-ShowMenu-Con-Avatar">
                    <img
                      className="InfoUserChat-ShowMenu-Con-Avatar-Img"
                      src={`http://localhost:3001/public/uploads/${ImageOfMe}`}
                    />
                    <p className="InfoUserChat-ShowMenu-Con-Avatar-name">
                      {NameOfMe}
                    </p>
                  </div>
                  <div className="gachngangCha">
                    <div className="gachngang"></div>
                  </div>
                  <div className="InfoUserChat-ShowMenu-Con-container-ShowAllUser">
                    <div className="InfoUserChat-ShowMenu-Con-container-ShowAllUser-Con">
                      {" "}
                      <i class="fa-solid fa-user-gear"></i>
                      <p className="InfoUserChat-ShowMenu-Con-container-ShowAllUser-text">
                        Xem tất cả trang cá nhân
                      </p>
                    </div>
                  </div>
                </div>
                <div className="container-Chucnang">
                  <div className="container-Chucnang-1">
                    <i class="fa-solid fa-gear"></i>
                  </div>
                  <p className="container-Chucnang-1-Text">
                    Cài đặt & quyền riêng tư
                  </p>
                  <i class="fa-solid fa-chevron-right container-Chucnang-1-Text-icon "></i>
                </div>
                <div className="container-Chucnang">
                  <div className="container-Chucnang-1">
                    <i class="fa-solid fa-circle-question"></i>
                  </div>
                  <p className="container-Chucnang-1-Text">Trợ giúp & Hỗ trợ</p>
                  <i class="fa-solid fa-chevron-right container-Chucnang-1-Text-icon "></i>
                </div>
                <div className="container-Chucnang">
                  <div className="container-Chucnang-1">
                    <i class="fa-solid fa-moon"></i>
                  </div>
                  <p className="container-Chucnang-1-Text">
                    Màn hình & Trợ năng
                  </p>
                  <i class="fa-solid fa-chevron-right container-Chucnang-1-Text-icon "></i>
                </div>
                <div className="container-Chucnang ">
                  <div className="container-Chucnang-1">
                    <i class="fa-solid fa-inbox"></i>
                  </div>
                  <p className="container-Chucnang-1-Text">Đóng góp ý kiến</p>
                  <i class="fa-solid fa-chevron-right container-Chucnang-1-Text-icon "></i>
                </div>
                <div className="container-Chucnang " onClick={handleLogout}>
                  <div className="container-Chucnang-1">
                    <i class="fa-solid fa-right-from-bracket"></i>
                  </div>
                  <p className="container-Chucnang-1-Text">Đăng xuất</p>
                  <i class="fa-solid fa-chevron-right container-Chucnang-1-Text-icon "></i>
                </div>
                <div className="container-Chucnang-Foolter">
                  <span className="container-Chucnang-Foolter-text">
                    Quyền riêng tư
                  </span>{" "}
                  <span className="cham">.</span>
                  <span className="container-Chucnang-Foolter-text">
                    Điều khoản
                  </span>
                  <span className="cham">.</span>
                  <span className="container-Chucnang-Foolter-text">
                    Quảng cáo
                  </span>
                  <span className="cham">.</span>
                  <span className="container-Chucnang-Foolter-text">
                    Lựa chọn quảng cáo
                  </span>
                  <span className="cham">.</span>
                  <span className="container-Chucnang-Foolter-text">
                    Cookie
                  </span>
                  <span className="cham">.</span>
                  <span className="container-Chucnang-Foolter-text">
                    Xem thêm
                  </span>
                  <span className="cham">.</span>
                  <span className="container-Chucnang-Foolter-text">
                    Meta © 2024
                  </span>
                  <span className="cham">.</span>
                </div>
              </div>
            ) : (
              <div>
                {/* Nội dung của div khi ShowMenuAvatar là false */}
                <div className="InfoUserChat-container-img">
                  <img
                    className="container-img-avata"
                    src={`http://localhost:3001/public/uploads/${ImageOfMe}`}
                  />
                </div>
                <div className="InfoUserChat-container-name">
                  {" "}
                  <p className="InfoUserChat-name">{NameOfMe}</p>
                </div>
                <div className="InfoUserChat-container-trangthai-Cha">
                  <div className="InfoUserChat-container-trangthai">
                    <p className="InfoUserChat-trangthai">
                      <i class="fa-solid fa-lock"></i>Được mã hóa đầu cuối
                    </p>
                  </div>
                </div>
                <div className="InfoUserChat-container-icon-Cha">
                  <div className="InfoUserChat-icon-Cha">
                    <div className="InfoUserChat-icon">
                      <i class="fa-solid fa-circle-user"></i>
                    </div>
                    <p className="InfoUserChat-textTrangcanhan">
                      Trang cá nhâ...
                    </p>
                  </div>
                  <div className="InfoUserChat-icon-Cha">
                    <div className="InfoUserChat-icon">
                      <i class="fa-solid fa-bell caichuong "></i>
                    </div>
                    <p className="InfoUserChat-textTrangcanhan">
                      Tắt thông báo
                    </p>
                  </div>
                  <div className="InfoUserChat-icon-Cha">
                    <div className="InfoUserChat-icon">
                      <input
                        type="file"
                        style={{ display: "none" }}
                        id="fileInput"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="fileInput">
                        <i className="fa-solid fa-camera "></i>
                      </label>
                    </div>
                    <p className="InfoUserChat-textTrangcanhan">Đổi Avatar</p>
                  </div>
                </div>
                <div className="container-Xacnhanuploadhinh">
                  <button
                    className="Xacnhanuploadhinh classhover"
                    onClick={handleUpload}
                  >
                    Upload Avatar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Option />
      <VideoPlayer />
      <Notifications />
    </>
  );
};

export default Chat;
