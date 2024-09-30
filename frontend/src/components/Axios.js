import axios from 'axios';

// Create an Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/', // Base URL for your Django API
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // If you want to send cookies along with requests (for session auth)
});

export default axiosInstance;
