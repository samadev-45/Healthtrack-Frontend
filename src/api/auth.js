import api from "./axios";
import Cookies from "js-cookie";

// -------------------- LOGIN --------------------
export const login = async ({ email, password }) => {
  console.log("📨 RAW LOGIN REQUEST:", { email, password });

  const res = await api.post("/Auth/login", { email, password });
  const payload = res.data;

  if (payload?.data?.refreshToken) {
    Cookies.set("refresh_token", payload.data.refreshToken, {
      secure: true,
      sameSite: "None",
    });
  }

  return payload; 
};

// -------------------- REGISTER --------------------
export const register = async (payload) => {
  const res = await api.post("/Auth/register", payload);
  return res.data;
};

// -------------------- CARETAKER OTP --------------------
export const caretakerRequestOtp = async ({ email, fullName }) => {
  const res = await api.post("/Auth/caretaker/request-email-otp", {
    email,
    fullName,
  });
  return res.data;
};

export const caretakerVerifyOtp = async ({ email, otp }) => {
  const res = await api.post("/Auth/caretaker/verify-email-otp", {
    email,
    otp,
  });

  if (res.data?.refreshToken) {
    Cookies.set("refresh_token", res.data.refreshToken, {
      secure: true,
      sameSite: "None",
    });
  }

  return res.data;
};

// -------------------- LOGOUT --------------------
export const logout = async () => {
  try {
    await api.post("/Auth/logout"); // optional: depends if backend has route
  } finally {
    Cookies.remove("refresh_token");
  }
};
