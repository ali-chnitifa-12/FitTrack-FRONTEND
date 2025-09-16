import axios from "axios";

const api = axios.create({
  baseURL:"https://fittrack-backend.railway.app/api",
  withCredentials: true, // ADD THIS LINE
});

// Add request interceptor to include token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;