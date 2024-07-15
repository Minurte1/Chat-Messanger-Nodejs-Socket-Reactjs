import axios from "axios";

const registerNewUser = (email, phone, username, password) => {
  return axios.post("http://localhost:3001/api/users/createUser", {
    email,
    phone,
    username,
    password,
  });
};
const LoginUser = (valueLogin, password) => {
  const email = valueLogin;
  return axios.post("http://localhost:3001/api/users/login", {
    email,
    password,
  });
};
const ListConversations = (idUser) => {
  return axios.post("http://localhost:3001/api/conversations/conversations", {
    userId: idUser,
  });
};

export { registerNewUser, LoginUser, ListConversations };
