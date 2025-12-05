import api from "./axios";
import { normalizeKeys } from "../utils/normalize";

// Helper to extract data from ApiResponse or direct response
const extractData = (response) => {
  // If wrapped in ApiResponse: r.data.Data
  // If direct response: r.data
  const data = response.data?.Data ?? response.data;
  return normalizeKeys(data);
};

export const getPatientConsultations = (params = {}) =>
  api.get("/Consultation/patient", { params })
    .then(extractData);

export const getConsultationsByDoctor = (params = {}) =>
  api.get("/Consultation/doctor", { params })
    .then(extractData);

export const getConsultationDetails = (id) =>
  api.get(`/Consultation/${id}`)
    .then(extractData);

export const createConsultation = (appointmentId, payload = {}) =>
  api.post(`/Consultation/${appointmentId}`, payload)
    .then(extractData);

export const updateConsultation = (id, payload) =>
  api.put(`/Consultation/${id}`, payload)
    .then(extractData);

export const finalizeConsultation = (id) =>
  api.post(`/Consultation/${id}/finalize`)
    .then(extractData);

export const uploadAttachment = (id, file) => {
  const fd = new FormData();
  fd.append("file", file);

  return api
    .post(`/Consultation/${id}/attachments`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(extractData);
};

export const downloadConsultationFile = (consultationId, fileId) =>
  api
    .get(`/Consultation/${consultationId}/files/${fileId}`, {
      responseType: "blob",
    })
    .then(r => r.data);
