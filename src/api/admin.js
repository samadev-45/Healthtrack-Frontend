import api from "./axios";

export const getPendingUsers = async () => {
  const res = await api.get("/Auth/admin/users/pending");
  return res.data;
};

export const toggleUserStatus = async (userId, status) => {
  const res = await api.post(`/Auth/admin/users/${userId}/toggle-status`, {
    status,
  });
  return res.data;
};
