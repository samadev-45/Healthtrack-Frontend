// src/store/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPatientProfile, updatePatientProfile } from "../api/patient";

export const fetchProfile = createAsyncThunk(
  "profile/get",
  async () => await getPatientProfile() // already Data
);

export const saveProfile = createAsyncThunk(
  "profile/save",
  async (payload) => await updatePatientProfile(payload)
);

const slice = createSlice({
  name: "profile",
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProfile.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchProfile.fulfilled, (s, a) => {
      s.loading = false;
      s.data = a.payload;
    });
    b.addCase(saveProfile.fulfilled, (s, a) => {
      s.data = a.payload;
    });
  },
});

export default slice.reducer;
