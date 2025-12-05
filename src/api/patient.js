import api from "./axios";
import { normalizeKeys } from "../utils/normalize";

/* ---------------------- PATIENT DASHBOARD ---------------------- */
export const getPatientDashboard = (params = {}) => {
  return api.get("/Dashboard/patient", { params })
    .then(res => normalizeKeys(res.data.Data));
};

/* ---------------------- GET PATIENT PROFILE ---------------------- */
export const getPatientProfile = () => 
  api.get("/patient/profile")
    .then(res => normalizeKeys(res.data.Data));

/* ---------------------- UPDATE PATIENT PROFILE ---------------------- */
export const updatePatientProfile = (data) =>
  api.put("/patient/profile", data)
    .then(res => normalizeKeys(res.data.Data));
