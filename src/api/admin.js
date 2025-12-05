import api from "./axios";
import { normalizeKeys } from "../utils/normalize";

export const getPendingUsers = () =>
  api.get("/Auth/admin/users/pending")
    .then(r => normalizeKeys(r.data.Data));

export const toggleUserStatus = (userId, status) =>
  api
    .post(`/Auth/admin/users/${userId}/toggle-status`, { status })
    .then(r => normalizeKeys(r.data.Data));
