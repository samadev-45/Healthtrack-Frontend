import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("authUser")
  ? JSON.parse(localStorage.getItem("authUser"))
  : {
      isAuthenticated: false,
      role: null,
      fullName: null,
      email: null,
    };

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: storedUser.isAuthenticated,
    role: storedUser.role,
    fullName: storedUser.fullName,
    email: storedUser.email,
  },
  reducers: {
    loginSuccess: (state, action) => {
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

    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.fullName = null;
      state.email = null;

      localStorage.removeItem("authUser");
    },
  },
});

export const { loginSuccess, logoutUser } = authSlice.actions;
export default authSlice.reducer;
