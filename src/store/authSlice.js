import { createSlice } from "@reduxjs/toolkit";

const stored = JSON.parse(localStorage.getItem("authUser") || "{}");

const initial = {
  isAuthenticated: stored.isAuthenticated || false,
  role: stored.role || null,
  fullName: stored.fullName || null,
  email: stored.email || null,
};

const slice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    loginSuccess(state, action) {
      const { role, fullName, email } = action.payload;

      state.isAuthenticated = true;
      state.role = role;
      state.fullName = fullName;
      state.email = email;

      localStorage.setItem(
        "authUser",
        JSON.stringify({
          isAuthenticated: true,
          role,
          fullName,
          email,
        })
      );
    },

    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.role = null;
      state.fullName = null;
      state.email = null;
      localStorage.removeItem("authUser");
    },
  },
});

export const { loginSuccess, logoutSuccess } = slice.actions;
export default slice.reducer;
