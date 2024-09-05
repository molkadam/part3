import axios from "axios";
import Cookies from "js-cookie";
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const token = Cookies.get("token");

const fileUpload = async (filesDetail) => {
  const response = await axios.post(`${API_ENDPOINT}/uploads`, filesDetail, {
    headers: {
      Authorization: token,
    },
  });
  return response;
};

const getFiles = async () => {
  const response = await axios.get(`${API_ENDPOINT}/uploads`, {
    headers: {
      Authorization: token,
    },
  });
  return response;
};
export { fileUpload, getFiles };
