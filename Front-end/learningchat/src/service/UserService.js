import axios from "axios";

const registerNewUser = (email, phone, username, password) => {
  return axios.post("http://localhost:3001/api/createUser", {
    email,
    phone,
    username,
    password,
  });
};
const LoginUser = (valueLogin, password) => {
  return axios.post("http://localhost:3001/api/createUser", {
    valueLogin,
    password,
  });
};
export { registerNewUser, LoginUser };
