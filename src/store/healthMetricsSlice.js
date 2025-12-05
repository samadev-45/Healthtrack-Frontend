// src/store/healthMetricsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyMetrics,
  createHealthMetric,
  getTodayAbnormal,
  getTrend,
} from "../api/healthmetrics";

const sortDesc = (items) =>
  [...items].sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt));

export const fetchMyMetrics = createAsyncThunk(
  "metrics/list",
  async (params = {}) => {
    return await getMyMetrics(params); // returns { items, totalCount }
  }
);

export const postMetric = createAsyncThunk(
  "metrics/create",
  async (payload) => await createHealthMetric(payload)
);

export const fetchTodayAbnormal = createAsyncThunk(
  "metrics/abnormalToday",
  async () => await getTodayAbnormal()
);

export const fetchTrend = createAsyncThunk(
  "metrics/trend",
  async ({ metricTypeId, days = 30 }) => {
    const data = await getTrend(metricTypeId, days);
    return { metricTypeId, data };
  }
);

const slice = createSlice({
  name: "healthMetrics",
  initialState: {
    list: { items: [], totalCount: 0, loading: false, error: null },
    abnormalToday: { items: [], loading: false, error: null },
    trend: {}, // keyed by metricTypeId
  },
  reducers: {},
  extraReducers: (b) => {
    /** LIST **/
    b.addCase(fetchMyMetrics.pending, (s) => {
      s.list.loading = true;
      s.list.error = null;
    });
    b.addCase(fetchMyMetrics.fulfilled, (s, a) => {
      s.list.loading = false;
      s.list.items = sortDesc(a.payload.items || []);
      s.list.totalCount = a.payload.totalCount || s.list.items.length;
    });
    b.addCase(fetchMyMetrics.rejected, (s, a) => {
      s.list.loading = false;
      s.list.error = a.error.message;
    });

    /** CREATE **/
    b.addCase(postMetric.fulfilled, (s, a) => {
      s.list.items = sortDesc([a.payload, ...s.list.items]);
      s.list.totalCount++;
    });

    /** TODAY ABNORMAL **/
    b.addCase(fetchTodayAbnormal.pending, (s) => {
      s.abnormalToday.loading = true;
    });
    b.addCase(fetchTodayAbnormal.fulfilled, (s, a) => {
      s.abnormalToday.loading = false;
      s.abnormalToday.items = a.payload || [];
    });

    /** TREND **/
    b.addCase(fetchTrend.pending, (s, a) => {
      s.trend[a.meta.arg.metricTypeId] = { loading: true, data: null };
    });
    b.addCase(fetchTrend.fulfilled, (s, a) => {
      s.trend[a.payload.metricTypeId] = {
        loading: false,
        data: a.payload.data,
      };
    });
  },
});

export default slice.reducer;
