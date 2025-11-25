// src/api/prescription.js
import api from "./axios";

// All functions return api.<method>(...).then(r => r.data)
// Your backend wraps responses in { success, message, data, statusCode } so
// callers (slices) should unwrap with payload.data or payload.

export const createOrGetPrescription = (consultationId, payload) =>
  api.post(`/consultations/${consultationId}/Prescription`, payload).then((r) => r.data);

export const getPrescriptionByConsultation = (consultationId) =>
  api.get(`/consultations/${consultationId}/Prescription`).then((r) => r.data);

export const addPrescriptionItem = (consultationId, itemPayload) =>
  api.post(`/consultations/${consultationId}/Prescription/items`, itemPayload).then((r) => r.data);

export const updatePrescriptionItem = (consultationId, itemId, itemPayload) =>
  api.put(`/consultations/${consultationId}/Prescription/items/${itemId}`, itemPayload).then((r) => r.data);

export const deletePrescriptionItem = (consultationId, itemId) =>
  api.delete(`/consultations/${consultationId}/Prescription/items/${itemId}`).then((r) => r.data);
