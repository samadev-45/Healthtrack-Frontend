import api from "./axios";
import { normalizeKeys } from "../utils/normalize";

/* LOGIN */
export const login = async ({ email, password }) => {
  try {
    const res = await api.post("/Auth/login", { email, password });

    // Normalize PascalCase → camelCase before returning
    return normalizeKeys(res.data.Data);

  } catch (error) {
    const status = error.response?.status;
    const backend = error.response?.data;

    // Backend returns Message (PascalCase)
    const message = backend?.Message || backend?.message;

    if (status === 403) throw new Error(message || "Not approved");
    if (status === 401) throw new Error("Invalid email or password");

    throw new Error(message || "Login failed");
  }
};

/* REGISTER */
export const register = (payload) =>
  api.post("/Auth/register", payload)
    .then(r => normalizeKeys(r.data.Data));

/* CARETAKER FLOW */
export const caretakerRequestOtp = (data) =>
  api.post("/Auth/caretaker/request-email-otp", data)
    .then(r => normalizeKeys(r.data.Data));

export const caretakerVerifyOtp = (data) =>
  api.post("/Auth/caretaker/verify-email-otp", data)
    .then(r => normalizeKeys(r.data.Data));

/* FORGOT PASSWORD */
export const forgotPasswordRequestOtp = (payload) =>
  api.post("/Auth/request-email-Otp", payload)
    .then(r => normalizeKeys(r.data.Data));

export const forgotPasswordVerifyOtp = (payload) =>
  api.post("/Auth/Verify-email-Otp", payload)
    .then(r => normalizeKeys(r.data.Data));

/* LOGOUT */
export const logout = () =>
  api.post("/Auth/logout").then(() => ({ success: true }));
