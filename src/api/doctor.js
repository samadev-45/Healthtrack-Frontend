import api from "./axios";

/** ------------------ FETCH ALL DOCTORS ------------------ */
export const getDoctors = async () => {
  const res = await api.get("/Doctor/list");
  return res.data; // returns array of doctors
};

/** ------------------ FETCH DOCTOR AVAILABILITY ------------------ */
export const getDoctorAvailability = async (doctorId, date) => {
  const res = await api.get(`/Doctor/availability/${doctorId}`, {
    params: { date },
  });

  return res.data.data; 
  /**
   * Expected backend response format:
   * {
   *   success: true,
   *   data: {
   *     hospital: "Apollo",
   *     location: "Chennai",
   *     slots: ["09:00:00", "09:30:00", ...]
   *   }
   * }
   */
};
