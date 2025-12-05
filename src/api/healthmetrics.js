import api from "./axios";
import { normalizeKeys } from "../utils/normalize";

export const createHealthMetric = (payload) =>
  api.post("/healthmetrics", payload)
    .then(r => normalizeKeys(r.data.Data));

export const updateHealthMetric = (id, payload) =>
  api.put(`/healthmetrics/${id}`, payload)
    .then(r => normalizeKeys(r.data.Data));

export const deleteHealthMetric = (id) =>
  api.delete(`/healthmetrics/${id}`)
    .then(r => normalizeKeys(r.data.Data));

export const getMyMetrics = (params = {}) =>
  api.get("/healthmetrics/me", { params })
    .then(r => normalizeKeys(r.data.Data));

export const getTodayAbnormal = () =>
  api.get("/healthmetrics/abnormal/today")
    .then(r => normalizeKeys(r.data.Data));

export const getTrend = (metricTypeId, days = 30) =>
  api
    .get("/healthmetrics/trend", { params: { metricTypeId, days } })
    .then(r => normalizeKeys(r.data.Data));
