import axios from "axios";
import Cookies from "js-cookie";
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
const loggdin = JSON.parse(localStorage.getItem("loggdin"));
// const token = JSON.parse(localStorage.getItem("loggdin")).token;
const token = Cookies.get('token');

const registerNewUser = async (newUser) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/users`, newUser);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status == 404) {
      } else if (error.response.status == 400) {
        return { error: error.response };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
};

const loginUser = async (credentials) => {
  console.log(credentials);
  try {
    const response = await axios.post(`${API_ENDPOINT}/login`, credentials);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const getUsers = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/users`, {
      headers: {
        Authorization: token,
      },
    });
    const data = response.data;
    if (!data) {
      throw new Error('No data returned from API');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, user) => {
  const response = await axios.put(`${API_ENDPOINT}/users/${id}`, user, {
    headers: {
        Authorization: token,
    },
  });
  return response.data;
};

const deleteUser = async (id) => {
  const response = await axios.delete(`${API_ENDPOINT}/users/${id}`, {
    headers: {
        Authorization: token,
    },
  });
  return response.data;
};

const userGetById = async (id) => {
    const response = await axios.get(`${API_ENDPOINT}/users/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data[0].name)
      return response.data[0];
}


export { registerNewUser, loginUser, getUsers, updateUser, deleteUser, userGetById };
