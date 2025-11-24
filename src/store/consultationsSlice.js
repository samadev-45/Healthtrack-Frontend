
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPatientConsultations, getConsultationDetails } from "../api/consultation";

export const fetchPatientConsultations = createAsyncThunk(
  "consultations/fetchList",
  async (filters = {}) => {
    const resp = await getPatientConsultations(filters);
    return resp;
  }
);

export const fetchConsultationDetails = createAsyncThunk(
  "consultations/fetchDetails",
  async (id) => {
    const resp = await getConsultationDetails(id);
    return resp;
  }
);

const consultationsSlice = createSlice({
  name: "consultations",
  initialState: {
    list: { items: [], totalCount: 0, loading: false, error: null },
    details: { data: null, loading: false, error: null }
  },
  reducers: {
    clearDetails(state) {
      state.details = { data: null, loading: false, error: null };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientConsultations.pending, (state) => {
        state.list.loading = true;
        state.list.error = null;
      })
      .addCase(fetchPatientConsultations.fulfilled, (state, action) => {
        state.list.loading = false;
        // backend returns { TotalCount, Items } or { totalCount, items }
        state.list.items = action.payload.items ?? action.payload.Items ?? [];
        state.list.totalCount = action.payload.totalCount ?? action.payload.TotalCount ?? state.list.items.length;
      })
      .addCase(fetchPatientConsultations.rejected, (state, action) => {
        state.list.loading = false;
        state.list.error = action.error.message;
      })

      .addCase(fetchConsultationDetails.pending, (state) => {
        state.details.loading = true;
        state.details.error = null;
      })
      .addCase(fetchConsultationDetails.fulfilled, (state, action) => {
        state.details.loading = false;
        state.details.data = action.payload;
      })
      .addCase(fetchConsultationDetails.rejected, (state, action) => {
        state.details.loading = false;
        state.details.error = action.error.message;
      });
  }
});

export const { clearDetails } = consultationsSlice.actions;
export default consultationsSlice.reducer;
