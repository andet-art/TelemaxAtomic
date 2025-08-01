import axios from 'axios';

const API_URL = 'http://134.122.71.254:4000/api/users/signup';

export const signupHandler = async (userData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}) => {
  try {
    const res = await axios.post(API_URL, userData);
    return res.data;
  } catch (err: any) {
    throw err.response?.data || { message: 'Signup failed' };
  }
};
