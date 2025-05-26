import axios from "axios";
import { useStateContext } from "./contexts/ContextProvider";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to headers
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors properly
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    // Check if response exists and handle error status
    if (response) {
      if (response.status === 401) {
        localStorage.removeItem('ACCESS_TOKEN');
        // Optionally redirect or refresh page
      } else if (response.status === 404) {
        // Handle 404 Not Found errors here
        console.log("Resource not found!");
      }
    } else {
      // Handle network or request errors (e.g., CORS, no internet)
      console.log("Network Error or No Response:", error.message);
    }

    // Always throw the error after handling it
    throw error;
  }
);

export default axiosClient;
