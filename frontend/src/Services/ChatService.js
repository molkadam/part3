import axios from "axios";
import Cookies from "js-cookie";
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const token = Cookies.get("token");

const addMessage = async (chatData) => {
    console.log(chatData);
    
  const response = await axios.post(`${API_ENDPOINT}/chats`, chatData, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

const getMessages = async () => {
  const response = await axios.get(`${API_ENDPOINT}/chats`,{
    headers: {
        Authorization: token,
    }
  });
  console.log(response);
  return response.data;
};

export { addMessage, getMessages };
