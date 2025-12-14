import axios from "axios";
import SummaryApi from "../common/SummaryApi";

const baseURL = import.meta.env.VITE_API_URL;

const Axios = axios.create({
  baseURL,
  withCredentials: true, // Because refresh token is cookie-based
});

// Avoid multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request Interceptor
Axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh Token Function
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const response = await Axios({
    ...SummaryApi.refreshToken,
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  return response.data.data.accessToken;
};

// Response Interceptor (Auto Refresh Token)
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return Axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        localStorage.setItem("accessToken", newToken);
        Axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return Axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logoutUser(); // Redirect & clear storage
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Proper Logout Handler
const logoutUser = () => {
  localStorage.clear();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

export default Axios;
