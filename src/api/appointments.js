import api from "./axios";
import { normalizeKeys } from "../utils/normalize";

export const getPatientAppointments = ({ status = null, page = 1, pageSize = 10 } = {}) =>
  api.get("/Appointment/patient", { params: { status, page, pageSize } })
     .then(r => normalizeKeys(r.data.Data));

export const createAppointment = (payload) =>
  api.post("/Appointment", payload)
    .then(r => normalizeKeys(r.data.Data));

export const rescheduleAppointment = (id, payload) =>
  api.post(`/Appointment/${id}/reschedule`, payload)
    .then(r => normalizeKeys(r.data.Data));

export const cancelAppointment = (id, payload = {}) =>
  api.post(`/Appointment/${id}/cancel`, payload)
    .then(r => normalizeKeys(r.data.Data));

export const getAppointmentById = (id) =>
  api.get(`/Appointment/${id}`)
    .then(r => normalizeKeys(r.data.Data));
