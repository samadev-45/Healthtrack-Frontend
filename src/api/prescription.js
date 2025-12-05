import api from "./axios";
import { normalizeKeys } from "../utils/normalize";

export const createOrGetPrescription = (consultationId, payload = {}) =>
  api
    .post(`/consultations/${consultationId}/Prescription`, payload)
    .then(r => normalizeKeys(r.data.Data));

export const getPrescriptionByConsultation = (consultationId) =>
  api
    .get(`/consultations/${consultationId}/Prescription`)
    .then(r => normalizeKeys(r.data.Data));

export const addPrescriptionItem = (consultationId, payload) =>
  api
    .post(`/consultations/${consultationId}/Prescription/items`, payload)
    .then(r => normalizeKeys(r.data.Data));

export const updatePrescriptionItem = (consultationId, itemId, payload) =>
  api
    .put(`/consultations/${consultationId}/Prescription/items/${itemId}`, payload)
    .then(r => normalizeKeys(r.data.Data));

export const deletePrescriptionItem = (consultationId, itemId) =>
  api
    .delete(`/consultations/${consultationId}/Prescription/items/${itemId}`)
    .then(r => normalizeKeys(r.data.Data));
