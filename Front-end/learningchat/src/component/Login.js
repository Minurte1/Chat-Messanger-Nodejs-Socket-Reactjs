import React, { useState } from "react";
import "../component/Login.css"; // Import CSS file
// import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import LogoFb from "./image/logo.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginUser, ListConversations } from "../service/UserService";

const LoginForm = () => {
  const navigate = useNavigate();
  const [valueLogin, setvalueLogin] = useState("");
  const [password, setPassword] = useState("");
  const [objectCheckInput, setObjectCheckInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const defaultValidInput = {
    isValueLogin: true,
    isPassword: true,
  };
  console.log("=>> check pass and login =>>", valueLogin, password);
  const handleCreateUser = () => {
    navigate("/register");
  };
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      setObjectCheckInput(defaultValidInput);
      if (!valueLogin) {
        setObjectCheckInput({ ...defaultValidInput, isValueLogin: false });
        toast.error("Please enter your email address or phone number");
        return;
      }
      if (!password) {
        setObjectCheckInput({ ...defaultValidInput, isValuePassword: false });
        toast.error("Please enter your password");
        return;
      }

      let data = {
        isAuthenticated: true,
        token: "fake token",
      };
      let response = await LoginUser(valueLogin, password);
      console.log(response.data.message);
      if (response && response.data.EC === 0) {
        sessionStorage.setItem("account", JSON.stringify(data));
        console.log("id=>", response.data._id._id);
        await ListConversations(response.data._id._id);

        navigate(`/message/${response.data._id._id}`);

        toast.success(response.data.EM);
        // window.location.reload();
      }
      if (response && response.data.EC !== 0) {
        toast.error(response.data.EM);
      }
    } catch (error) {
      console.log("OoO Error !! =>", error);
    }
  };
  const handleLoginHaveEnter = async (event) => {
    // event.preventDefault();

    try {
      setObjectCheckInput(defaultValidInput);
      if (!valueLogin) {
        setObjectCheckInput({ ...defaultValidInput, isValueLogin: false });
        toast.error("Please enter your email address or phone number");
        return;
      }
      if (!password) {
        setObjectCheckInput({ ...defaultValidInput, isValuePassword: false });
        toast.error("Please enter your password");
        return;
      }

      let data = {
        isAuthenticated: true,
        token: "fake token",
      };
      let response = await LoginUser(valueLogin, password);
      if (response && response.data.EC === 0) {
        sessionStorage.setItem("account", JSON.stringify(data));
        navigate("/users");
        toast.success(response.data.EM);
        window.location.reload();
      }
      if (response && response.data.EC !== 0) {
        toast.error(response.data.EM);
      }
    } catch (error) {
      console.log("OoO Error !! =>", error);
    }
  };
  const handlePressEnter = (event) => {
    if (event.charCode == 13) {
      handleLoginHaveEnter();
    }
  };
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
          <div className="form-login">
            <form>
              <input
                type="text"
                placeholder="Email address or phone number"
                className={
                  objectCheckInput.isValueLogin
                    ? "form-control input1 margin2px"
                    : "form-control input1 margin2px is-invalid"
                }
                value={valueLogin}
                onChange={(event) => setvalueLogin(event.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className={
                  objectCheckInput.isPassword
                    ? "form-control input2 margin2px"
                    : "form-control input2 margin2px is-invalid"
                }
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                onKeyPress={(event) => handlePressEnter(event)}
              />

              <button type="submit" className="button" onClick={handleLogin}>
                Log in
              </button>
              <a href="">Forgotten password?</a>
              <div className="thanhnang"></div>
              <button
                type="submit"
                onClick={handleCreateUser}
                className="button1"
              >
                Create new account
              </button>
            </form>
          </div>
          <a className="create"> Create a Page</a>{" "}
          <span>for a celebrity, brand or business.</span>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
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

function Login() {
  return (
    <>
      <LoginForm />
      <Footer />
    </>
  );
}

export default Login;
