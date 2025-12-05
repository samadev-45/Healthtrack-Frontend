import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPatientConsultations, getConsultationDetails } from "../api/consultation";

export const fetchPatientConsultations = createAsyncThunk(
  "consultations/list",
  async (filters) => {
    return await getPatientConsultations(filters);
  }
);

export const fetchConsultationDetails = createAsyncThunk(
  "consultations/details",
  async (id) => {
    return await getConsultationDetails(id);
  }
);

const slice = createSlice({
  name: "consultations",
  initialState: {
    list: { items: [], totalCount: 0, loading: false, error: null },
    details: { data: null, loading: false, error: null },
  },
  reducers: {
    clearDetails(state) {
      state.details = { data: null, loading: false, error: null };
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchPatientConsultations.pending, (s) => {
      s.list.loading = true;
      s.list.error = null;
    })
      .addCase(fetchPatientConsultations.fulfilled, (s, a) => {
        s.list.loading = false;
        // API returns normalized { items, totalCount } from PagedResult
        const payload = a.payload || {};
        s.list.items = payload.items || [];
        s.list.totalCount = payload.totalCount || s.list.items.length;
      })
      .addCase(fetchPatientConsultations.rejected, (s, a) => {
        s.list.loading = false;
        s.list.error = a.error.message;
      });

    b.addCase(fetchConsultationDetails.pending, (s) => {
      s.details.loading = true;
      s.details.error = null;
    })
      .addCase(fetchConsultationDetails.fulfilled, (s, a) => {
        s.details.loading = false;
        s.details.data = a.payload;
      })
      .addCase(fetchConsultationDetails.rejected, (s, a) => {
        s.details.loading = false;
        s.details.error = a.error.message;
      });
  },
});

export const { clearDetails } = slice.actions;
export default slice.reducer;
