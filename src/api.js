import axios from 'axios';
require('dotenv').config();

const API = axios.create({
  baseURL: process.env.VITE_API_BASE || 'http://localhost:4000/api',
  timeout: 10000
});
export default API;
