import axios from "./axios"; 

export const getPatientDashboard = (params = {}) => {
 
  return axios.get("/Dashboard/patient", { params });
};
