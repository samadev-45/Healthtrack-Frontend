
import api from "./axios";
import axios from "axios";

export const getPatientConsultations = (params = {}) =>
  api.get("/consultation/patient", { params }).then((r) => r.data);

export const getConsultationDetails = (consultationId) =>
  api.get(`/consultation/${consultationId}`).then((r) => r.data);


export const downloadConsultationFile = (consultationId, fileId) =>
  axios
    .get(`/api/consultation/${consultationId}/files/${fileId}`, {
      responseType: "blob",
      withCredentials: true
    })
    .then((r) => r.data);
