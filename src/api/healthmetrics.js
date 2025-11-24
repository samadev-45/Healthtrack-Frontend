// src/api/healthmetrics.js
import api from "./axios";

export const createHealthMetric = (payload) =>
  api.post("/healthmetrics", payload).then((r) => r.data);

export const updateHealthMetric = (id, payload) =>
  api.put(`/healthmetrics/${id}`, payload).then((r) => r.data);

export const deleteHealthMetric = (id) =>
  api.delete(`/healthmetrics/${id}`).then((r) => r.data);

export const getMyMetrics = (params = {}) =>
  api.get("/healthmetrics/me", { params }).then((r) => r.data);

export const getTodayAbnormal = () =>
  api.get("/healthmetrics/abnormal/today").then((r) => r.data);

export const getTrend = (metricTypeId, days = 30) =>
  api.get("/healthmetrics/trend", { params: { metricTypeId, days } }).then((r) => r.data);
