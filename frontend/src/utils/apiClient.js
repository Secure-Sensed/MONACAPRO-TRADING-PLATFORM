import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`
});

api.interceptors.request.use(async (config) => {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    const token = await firebaseUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    const token = localStorage.getItem('session_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
