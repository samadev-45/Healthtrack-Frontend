import axios from "./axios";

export const getPatientAppointments = ({ status = null, page = 1, pageSize = 10 } = {}) =>
  axios.get("/Appointment/patient", { params: { status, page, pageSize } });

export const createAppointment = (payload) => {
  console.log(" Sending appointment payload:", payload);
  return axios.post("/Appointment", payload);
};

export const rescheduleAppointment = (appointmentId, payload) =>{
  console.log("payload:" , payload);
  return axios.post(`/Appointment/${appointmentId}/reschedule`, payload);
};

export const cancelAppointment = (appointmentId, payload = {}) =>{
  return axios.post(`/Appointment/${appointmentId}/cancel`, payload);
};

export const getAppointmentById = (id) =>{
  return axios.get(`/Appointment/${id}`);
};
