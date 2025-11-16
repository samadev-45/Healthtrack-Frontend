import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Refresh lock system
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ reject, resolve }) => {
    if (error) reject(error);
    else resolve(true);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (!err.response || err.response.status !== 401) {
      return Promise.reject(err);
    }

    if (originalRequest._retry) {
      return Promise.reject(err);
    }
    originalRequest._retry = true;

    const refreshToken = Cookies.get("refresh_token");

    if (!refreshToken) {
      return Promise.reject(err); 
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      const res = await axios.post(
        "/api/Auth/refresh",
        { refreshToken },
        { baseURL: "/", withCredentials: true }
      );

      if (res.data?.data?.refreshToken) {
        Cookies.set("refresh_token", res.data.data.refreshToken, {
          secure: true,
          sameSite: "None",
        });
      }

      processQueue(null);
      isRefreshing = false;

      return api(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr);
      isRefreshing = false;
      Cookies.remove("refresh_token");

      return Promise.reject(refreshErr);
    }
  }
);

export default api;
