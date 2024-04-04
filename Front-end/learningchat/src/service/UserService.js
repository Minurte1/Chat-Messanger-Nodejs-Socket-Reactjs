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
  return axios.post("http://localhost:3001/login", {
    valueLogin,
    password,
  });
};
const ListConversations = (idUser) => {
  return axios.post("http://localhost:3001/api/conversations", {
    userId: idUser,
  });
};
const GetListAllUser = () => {
  return axios.get("http://localhost:3001/allusers");
};

export { registerNewUser, LoginUser, ListConversations, GetListAllUser };
