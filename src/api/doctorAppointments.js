import api from "./axios";
import { normalizeKeys } from "../utils/normalize";

export const getDoctorAppointments = (params = {}) => {
  return api
    .get("/Appointment/doctor", { params })
    .then((res) => normalizeKeys(res.data.Data));
};