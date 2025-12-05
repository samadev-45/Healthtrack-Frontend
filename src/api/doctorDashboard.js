import api from "./axios";
import { normalizeKeys } from "../utils/normalize";

export const getDoctorDashboard = (params = {}) =>
  api.get("/DoctorDashboard/overview", { params })
     .then(r => normalizeKeys(r.data.Data));
