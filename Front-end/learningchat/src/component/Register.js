import React, { useEffect, useState } from "react";
import "../component/register.css"; // Import CSS file
// import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import LogoFb from "./image/logo.svg";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";
// import "bootstrap/dist/css/bootstrap.min.css";
import { registerNewUser } from "../services/UserService";
const RegisterForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const defaultValidInput = {
    isValidEmail: true,
    isValidPhone: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
    isValidUsername: true,
  };
  const [confirmPassword, setconfirmPassword] = useState("");
  const [objectCheckInput, setObjectCheckInput] = useState(defaultValidInput);

  const LoginUser = () => {
    navigate("/");
  };

  const isValidEmail = (email) => {
    // Sử dụng regular expression để kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isValidPhone = (phone) => {
    // Sử dụng regular expression để kiểm tra định dạng email
    const vietnamesePhoneNumberRegex = /^(0[1-9])+([0-9]{8,9})\b/;
    return vietnamesePhoneNumberRegex.test(phone);
  };
  const isValiInput = () => {
    setObjectCheckInput(defaultValidInput);
    if (!email) {
      toast.error("Địa chỉ Email của bạn bị rỗng !");
      setObjectCheckInput({ ...defaultValidInput, isValidEmail: false });
      return false;
    }

    if (!isValidEmail(email)) {
      toast.error("Email không hợp lệ");
      setObjectCheckInput({ ...defaultValidInput, isValidEmail: false });
      return false;
    }
    if (!isValidPhone(phone)) {
      toast.error("Số điện thoại này không phải số điện thoại Việt Nam !!");
      setObjectCheckInput({ ...defaultValidInput, isValidPhone: false });
      return false;
    }

    if (!phone) {
      toast.error("Số điện thoại của bạn bị rỗng !");
      setObjectCheckInput({ ...defaultValidInput, isValidPhone: false });
      return false;
    }
    if (!username) {
      toast.error("Tên người dùng của bạn bị rỗng !");
      setObjectCheckInput({ ...defaultValidInput, isValidUsername: false });
      return false;
    }
    if (!password) {
      toast.error("Password của bạn bị rỗng !");
      setObjectCheckInput({ ...defaultValidInput, isValidPassword: false });
      return false;
    }
    if (!confirmPassword) {
      toast.error("Re-Password của bạn bị rỗng !");
      setObjectCheckInput({
        ...defaultValidInput,
        isValidConfirmPassword: false,
      });
      return false;
    }
  };
  const handleRegister = async (event) => {
    event.preventDefault();
    const userData = { email, phone, username, password, confirmPassword };
    console.log("checkdataform =>", userData);
    if (isValiInput() == false) {
      return;
    } else {
      try {
        let serverData = await registerNewUser(
          email,
          phone,
          username,
          password
        );
        console.log("check responve =>> ", serverData.data.EM);
        navigate("/");
        toast.success("Đã tạo thành công tài khoản !!");
        // if (+serverData.data.EC == 0) {
        //   toast.success(serverData.data.EM);

        // } else {
        //   toast.error(serverData.data.EM);
        //   return false;
        // }
      } catch (error) {
        console.log("OoO Lỗi rồi =>", error);
      }
    }
  };
  useEffect(() => {
    // axios.post("http://localhost:3003/api/v1/register").then(data =>{
    //     console.log("Check data =>",data)
    // })
  });
  // input1 form-control is-valid is-valid
  return (
    <div className="wrap">
      <div className="container-fb">
        <div className="fb-thongtin">
          <img
            src={LogoFb}
            className="fb"
            style={{ height: "100px", width: "300px" }}
            alt="Facebook logo"
          />
          <p>
            Facebook helps you connect and share with the people in your life.
          </p>
        </div>
        <div className="form">
          <div className=" form-register">
            <form>
              <input
                type="text"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email address "
                className={
                  objectCheckInput.isValidEmail
                    ? "input1 form-control"
                    : "input1 form-control is-invalid"
                }
              />
              <input
                type="text"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
                className={
                  objectCheckInput.isValidPhone
                    ? "input1 form-control"
                    : "input1 form-control is-invalid"
                }
              />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username "
                className={
                  objectCheckInput.isValidUsername
                    ? "input1 form-control"
                    : "input1 form-control is-invalid"
                }
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className={
                  objectCheckInput.isValidPassword
                    ? "input2 form-control"
                    : "input2 form-control is-invalid"
                }
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setconfirmPassword(event.target.value)}
                placeholder="Re- Password"
                className={
                  objectCheckInput.isValidConfirmPassword
                    ? "input2 form-control"
                    : "input2 form-control is-invalid"
                }
              />
              <button onClick={handleRegister} className="button">
                Đăng ký thành công
              </button>
              <a href="">Forgotten password?</a>
              <div className="thanhnang"></div>

              <button type="submit" onClick={LoginUser} className="button1">
                Chuyển Sang Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegisterFooter = () => {
  return (
    <div className="footer">
      <div className="footerall">
        <div className="footer-a">
          <a href="">English (UK)</a>
          <a href="">Tiếng Việt</a>
          <a href="">中文(台灣)</a>
          <a href="">한국어</a>
          <a href="">日本語</a>
          <a href="">Français (France)</a>
          <a href="">ภาษาไทย</a>
          <a href="">Español</a>
          <a href="">Português (Brasil)</a>
          <a href="">Deutsch</a>
          <a href="">Italiano</a>
        </div>
        <div className="footer-hr"></div>
        <div className="footer-a">{/* Your language links */}</div>
        <div className="footer-a">
          <a href="">Meta © 2024</a>
        </div>
      </div>
    </div>
  );
};

function Register() {
  return (
    <>
      <RegisterForm />
      <RegisterFooter />
    </>
  );
}

export default Register;
