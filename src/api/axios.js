import axios from "axios";

// API Instance
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,  
  headers: { "Content-Type": "application/json" },
});


let isRefreshing = false;
let queue = [];


const resolveQueue = () => {
  queue.forEach(({ resolve }) => resolve());
  queue = [];
};

const rejectQueue = (error) => {
  queue.forEach(({ reject }) => reject(error));
  queue = [];
};


api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const original = error.config;

    // Only handle 401
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite retries
    if (original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    // If refresh already happening → enqueue request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(() => api(original));
    }

    // Begin refresh
    isRefreshing = true;

    try {
     
      await api.post("/Auth/refresh");

      // Resolve queued requests
      resolveQueue();
      isRefreshing = false;

      return api(original);
    } catch (refreshError) {
      rejectQueue(refreshError);
      isRefreshing = false;

      return Promise.reject(refreshError);
    }
  }
);

export default api;
