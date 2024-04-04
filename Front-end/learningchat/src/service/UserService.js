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
  console.log("idUser =>", idUser);
  return axios.get(
    `http://localhost:3001/api/conversations/${idUser.toString()}`
  );
};

export { registerNewUser, LoginUser, ListConversations };
