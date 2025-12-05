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


// api.interceptors.response.use(
//   (res) => res,

//   async (error) => {
//     const original = error.config;

//     // Only handle 401
//     if (!error.response || error.response.status !== 401) {
//       return Promise.reject(error);
//     }

//     // Prevent infinite retries
//     if (original._retry) {
//       return Promise.reject(error);
//     }
//     original._retry = true;

//     // If refresh already happening → enqueue request
//     if (isRefreshing) {
//       return new Promise((resolve, reject) => {
//         queue.push({ resolve, reject });
//       }).then(() => api(original));
//     }

//     // Begin refresh
//     isRefreshing = true;

//     try {
     
//       await api.post("/Auth/refresh");

//       // Resolve queued requests
//       resolveQueue();
//       isRefreshing = false;

//       return api(original);
//     } catch (refreshError) {
//       rejectQueue(refreshError);
//       isRefreshing = false;

//       return Promise.reject(refreshError);
//     }
//   }
// );

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const url = original?.url || "";

    // ❌ DO NOT TOUCH LOGIN / LOGOUT / REFRESH
    if (
      url.includes("/Auth/login") ||
      url.includes("/Auth/logout") ||
      url.includes("/Auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // ❌ If request has NO auth header → do NOT refresh
    const hasAuthHeader =
      original.headers["Authorization"] ??
      original.headers["authorization"];

    if (!hasAuthHeader) {
      return Promise.reject(error);
    }

    // ❌ Only refresh on 401
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(() => api(original));
    }

    isRefreshing = true;

    try {
      await api.post("/Auth/refresh");

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
