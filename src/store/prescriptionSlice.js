// src/store/prescriptionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrGetPrescription,
  getPrescriptionByConsultation,
  addPrescriptionItem,
  updatePrescriptionItem,
  deletePrescriptionItem,
} from "../api/prescription";

export const fetchOrCreatePrescription = createAsyncThunk(
  "prescription/createOrGet",
  async ({ consultationId, dto = null }) => {
    return dto
      ? await createOrGetPrescription(consultationId, dto)
      : await getPrescriptionByConsultation(consultationId);
  }
);

export const addItem = createAsyncThunk(
  "prescription/addItem",
  async ({ consultationId, item }) =>
    await addPrescriptionItem(consultationId, item)
);

export const editItem = createAsyncThunk(
  "prescription/editItem",
  async ({ consultationId, itemId, item }) =>
    await updatePrescriptionItem(consultationId, itemId, item)
);

export const removeItem = createAsyncThunk(
  "prescription/removeItem",
  async ({ consultationId, itemId }) => {
    await deletePrescriptionItem(consultationId, itemId);
    return { itemId };
  }
);

const slice = createSlice({
  name: "prescription",
  initialState: { data: null, loading: false, error: null },
  reducers: {
    clearPrescription(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (b) => {
    /** LOAD **/
    b.addCase(fetchOrCreatePrescription.pending, (s) => {
      s.loading = true;
    });
    b.addCase(fetchOrCreatePrescription.fulfilled, (s, a) => {
      s.loading = false;
      s.data = a.payload;
    });

    /** ADD ITEM **/
    b.addCase(addItem.fulfilled, (s, a) => {
      s.data.items = [a.payload, ...(s.data.items || [])];
    });

    /** EDIT ITEM **/
    b.addCase(editItem.fulfilled, (s, a) => {
      const updated = a.payload;
      s.data.items = s.data.items.map((x) =>
        x.prescriptionItemId === updated.prescriptionItemId ? updated : x
      );
    });

    /** DELETE ITEM **/
    b.addCase(removeItem.fulfilled, (s, a) => {
      s.data.items = s.data.items.filter(
        (x) => x.prescriptionItemId !== a.payload.itemId
      );
    });
  },
});

export const { clearPrescription } = slice.actions;
export default slice.reducer;
