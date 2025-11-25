// src/store/prescriptionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrGetPrescription,
  getPrescriptionByConsultation,
  addPrescriptionItem,
  updatePrescriptionItem,
  deletePrescriptionItem,
} from "../api/prescription";

// helper to unwrap ApiResponse<T> -> T or fallback
const unwrapData = (payload) => (payload ? payload.data ?? payload : null);

// thunks
export const fetchOrCreatePrescription = createAsyncThunk(
  "prescription/fetchOrCreate",
  async ({ consultationId, createDto = null }) => {
    // if createDto provided we POST (create or get), else we GET
    if (createDto) {
      const resp = await createOrGetPrescription(consultationId, createDto);
      return resp;
    }
    const resp = await getPrescriptionByConsultation(consultationId);
    return resp;
  }
);

export const fetchPrescription = createAsyncThunk(
  "prescription/fetch",
  async ({ consultationId }) => {
    const resp = await getPrescriptionByConsultation(consultationId);
    return resp;
  }
);

export const addItem = createAsyncThunk(
  "prescription/addItem",
  async ({ consultationId, item }, { rejectWithValue }) => {
    try {
      const resp = await addPrescriptionItem(consultationId, item);
      return resp;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const editItem = createAsyncThunk(
  "prescription/editItem",
  async ({ consultationId, itemId, item }, { rejectWithValue }) => {
    try {
      const resp = await updatePrescriptionItem(consultationId, itemId, item);
      return resp;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const removeItem = createAsyncThunk(
  "prescription/removeItem",
  async ({ consultationId, itemId }, { rejectWithValue }) => {
    try {
      const resp = await deletePrescriptionItem(consultationId, itemId);
      return { payload: resp, itemId };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const slice = createSlice({
  name: "prescription",
  initialState: {
    data: null, // { prescriptionId, consultationId, createdByUserId, notes, createdAt, items: [] }
    loading: false,
    error: null,
  },
  reducers: {
    clearPrescription(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch/create
      .addCase(fetchOrCreatePrescription.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchOrCreatePrescription.fulfilled, (s, a) => {
        s.loading = false;
        s.data = unwrapData(a.payload) ?? a.payload;
      })
      .addCase(fetchOrCreatePrescription.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error?.message ?? "Failed to load prescription";
      })

      .addCase(fetchPrescription.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchPrescription.fulfilled, (s, a) => {
        s.loading = false;
        s.data = unwrapData(a.payload) ?? a.payload;
      })
      .addCase(fetchPrescription.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error?.message ?? "Failed to load prescription";
      })

      // add item
      .addCase(addItem.pending, (s) => {
        s.error = null;
      })
      .addCase(addItem.fulfilled, (s, a) => {
        const payload = unwrapData(a.payload) ?? a.payload;
        if (!s.data) s.data = { items: [] };
        // payload.data (the created item) - append to items
        s.data.items = [payload, ...(s.data.items || [])];
      })
      .addCase(addItem.rejected, (s, a) => {
        s.error = a.error?.message ?? "Failed to add item";
      })

      // edit item
      .addCase(editItem.pending, (s) => {
        s.error = null;
      })
      .addCase(editItem.fulfilled, (s, a) => {
        const payload = unwrapData(a.payload) ?? a.payload;
        if (!s.data?.items) return;
        s.data.items = s.data.items.map((it) =>
          (it.prescriptionItemId ?? it.PrescriptionItemId) ===
          (payload.prescriptionItemId ?? payload.PrescriptionItemId)
            ? payload
            : it
        );
      })
      .addCase(editItem.rejected, (s, a) => {
        s.error = a.error?.message ?? "Failed to update item";
      })

      // remove item
      .addCase(removeItem.pending, (s) => {
        s.error = null;
      })
      .addCase(removeItem.fulfilled, (s, a) => {
        if (!s.data?.items) return;
        const removedId = a.meta.arg.itemId;
        s.data.items = s.data.items.filter(
          (it) => (it.prescriptionItemId ?? it.PrescriptionItemId) !== removedId
        );
      })
      .addCase(removeItem.rejected, (s, a) => {
        s.error = a.error?.message ?? "Failed to delete item";
      });
  },
});

export const { clearPrescription } = slice.actions;
export default slice.reducer;
