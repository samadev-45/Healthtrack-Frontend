import api from "./axios";

/* -------------------------------- LOGIN -------------------------------- */
export const login = async ({ email, password }) => {
  console.log("📨 LOGIN REQUEST:", { email, password });

  try {
    const res = await api.post("/Auth/login", { email, password });

    // Backend sets cookies → frontend only returns payload
    return res.data;

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

  // Cookies are set by backend now → no jwt here
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

/* -------------------------------- LOGOUT -------------------------------- */
export const logout = async () => {
  try {
    // Server deletes HttpOnly cookies & revokes refresh token
    await api.post("/Auth/logout");

    return { success: true };
  } catch (err) {
    console.error("Logout failed:", err);
    return { success: false };
  }
};
