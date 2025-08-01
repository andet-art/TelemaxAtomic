import axios from 'axios';

const API_URL = 'http://134.122.71.254:4000/api/users/signin';

export const signinHandler = async (credentials: any) => {
  try {
    const res = await axios.post(API_URL, credentials);
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err.message;
  }
};
