import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import consultationsReducer from "./consultationsSlice";
import healthMetricsReducer from "./healthMetricsSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    consultations: consultationsReducer,
    healthMetrics: healthMetricsReducer
  },
});

export default store;
