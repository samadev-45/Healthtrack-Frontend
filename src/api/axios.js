import axios from "axios";
import Cookies from "js-cookie";

// Create API instance
const api = axios.create({
  baseURL: "/api",              
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Refresh lock
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(true)
  );
  failedQueue = [];
};

// Axios response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Not a 401 → return
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Already retried → reject
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) return Promise.reject(error);

    // Multiple 401 requests → queue them
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      // USE SAME API INSTANCE (respects proxy)
      const res = await api.post("/Auth/refresh", { refreshToken });

      const newToken = res.data?.data?.refreshToken;
      if (newToken) {
        Cookies.set("refresh_token", newToken, {
          secure: true,
          sameSite: "None",
        });
      }

      processQueue(null);
      isRefreshing = false;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      isRefreshing = false;
      Cookies.remove("refresh_token");

      return Promise.reject(refreshError);
    }
  }
);

export default api;
