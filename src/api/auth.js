import api from "./axios";
import Cookies from "js-cookie";

/* -------------------------------- LOGIN -------------------------------- */
export const login = async ({ email, password }) => {
  console.log("📨 LOGIN REQUEST:", { email, password });

  try {
    const res = await api.post("/Auth/login", { email, password });
    const payload = res.data;

    if (payload?.data?.refreshToken) {
      Cookies.set("refresh_token", payload.data.refreshToken, {
        secure: true,
        sameSite: "None",
      });
    }

    return payload;

  } catch (error) {

    const status = error.response?.status;
    const backend = error.response?.data;

    // Pending / Rejected
    if (status === 403) {
      const msg =
        backend?.message ||
        backend?.errors?.[0] ||
        "Your account is not approved";

      throw new Error(msg);
    }

    // Invalid password / not found
    if (status === 401) {
      throw new Error("Invalid email or password");
    }

    // Fallback
    throw new Error(backend?.message || "Something went wrong");
  }
};




/* ------------------------------ REGISTER ------------------------------ */
export const register = async (payload) => {
  const res = await api.post("/Auth/register", payload);
  return res.data;
};

/* ----------------------- CARETAKER EMAIL OTP LOGIN ----------------------- */
export const caretakerRequestOtp = async (data) => {
  const res = await api.post("/Auth/caretaker/request-email-otp", {
    email: data.email,
    fullName: data.fullName ?? "Caretaker",
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

/* --------------------------- FORGOT PASSWORD --------------------------- */
export const forgotPasswordRequestOtp = async ({ email }) => {
  const res = await api.post("/Auth/request-email-Otp", { email });
  return res.data;
};

export const forgotPasswordVerifyOtp = async ({
  email,
  otp,
  newPassword,
  confirmPassword,
}) => {
  const res = await api.post("/Auth/Verify-email-Otp", {
    email,
    otp,
    newPassword,
    confirmPassword,
  });

  return res.data;
};


export const logout = async () => {
  try {
    
    await api.post("/Auth/logout");

    
    Cookies.remove("refresh_token", {
      secure: true,
      sameSite: "None"
    });

    return { success: true };
  } catch (err) {
    console.error("Logout failed:", err);
    return { success: false };
  }
};