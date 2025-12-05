import api from "./axios";
import { normalizeKeys } from "../utils/normalize";

/* List doctors */
export const getDoctors = () =>
  api.get("/Doctor/list")
    .then(r => normalizeKeys(r.data.Data));

/* Availability */
export const getDoctorAvailability = (doctorId, date) =>
  api.get(`/Doctor/availability/${doctorId}`, { params: { date } })
     .then(r => normalizeKeys(r.data.Data));
