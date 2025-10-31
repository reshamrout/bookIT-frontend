import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: true, // if needed
});

export default API;
