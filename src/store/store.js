import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import consultationsReducer from "./consultationsSlice";
import healthMetricsReducer from "./healthMetricsSlice";
import prescriptionReducer from "./prescriptionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    consultations: consultationsReducer,
    healthMetrics: healthMetricsReducer,
    prescription: prescriptionReducer,
  },
});

export default store;
