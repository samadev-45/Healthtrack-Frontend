// src/store/healthMetricsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMyMetrics, createHealthMetric, getTodayAbnormal, getTrend } from "../api/healthmetrics";

// Helpers to cope with ApiResponse<T>
const unwrapData = (payload) => payload && (payload.data ?? payload);

const sortMetricsDesc = (items) =>
  items.slice().sort((a, b) => new Date(b.measuredAt) - new Date(a.measuredAt));

export const fetchMyMetrics = createAsyncThunk(
  "healthMetrics/fetchMyMetrics",
  async (params) => {
    const resp = await getMyMetrics(params);
    return resp;
  }
);

export const postHealthMetric = createAsyncThunk(
  "healthMetrics/post",
  async (payload) => {
    const resp = await createHealthMetric(payload);
    return resp;
  }
);

export const fetchTodayAbnormal = createAsyncThunk(
  "healthMetrics/fetchTodayAbnormal",
  async () => {
    const resp = await getTodayAbnormal();
    return resp;
  }
);

export const fetchTrend = createAsyncThunk(
  "healthMetrics/fetchTrend",
  async ({ metricTypeId, days = 30 }) => {
    const resp = await getTrend(metricTypeId, days);
    // keep metricTypeId in result for reducer convenience
    return { metricTypeId, payload: resp };
  }
);

const slice = createSlice({
  name: "healthMetrics",
  initialState: {
    list: { items: [], totalCount: 0, loading: false, error: null },
    abnormalToday: { items: [], loading: false, error: null },
    // trends keyed by metricTypeId
    trend: { dataById: {}, loadingById: {}, errorById: {} }
  },
  reducers: {
    clearTrendForMetric(state, action) {
      const id = action.payload;
      delete state.trend.dataById[id];
      delete state.trend.loadingById[id];
      delete state.trend.errorById[id];
    }
  },
  extraReducers: (builder) => {
    builder
      // LIST
      .addCase(fetchMyMetrics.pending, (s) => {
        s.list.loading = true;
        s.list.error = null;
      })
      .addCase(fetchMyMetrics.fulfilled, (s, a) => {
        s.list.loading = false;
        const payload = unwrapData(a.payload) || {};
        s.list.items = payload.items ?? payload.Items ?? [];
        s.list.totalCount = payload.totalCount ?? payload.TotalCount ?? s.list.items.length;
        // ensure sorted newest-first for consumers
        s.list.items = sortMetricsDesc(s.list.items);
      })
      .addCase(fetchMyMetrics.rejected, (s, a) => {
        s.list.loading = false;
        s.list.error = a.error.message;
      })

      // CREATE
      .addCase(postHealthMetric.pending, (s) => {
        // nothing special
      })
      .addCase(postHealthMetric.fulfilled, (s, a) => {
        const payload = unwrapData(a.payload);
        if (!payload) return;
        // If API returned the created metric object, insert and sort
        // Detect object vs data wrapper
        let created = null;
        if (payload.healthMetricId || payload.HealthMetricId || payload.HealthMetricId === 0 || payload.healthMetricId === 0) {
          created = payload;
        } else if (payload.data && (payload.data.healthMetricId || payload.data.HealthMetricId)) {
          created = payload.data;
        }
        if (created) {
          s.list.items = sortMetricsDesc([created, ...s.list.items]);
          s.list.totalCount = (s.list.totalCount || 0) + 1;
        }
      })

      // TODAY ABNORMAL
      .addCase(fetchTodayAbnormal.pending, (s) => {
        s.abnormalToday.loading = true;
        s.abnormalToday.error = null;
      })
      .addCase(fetchTodayAbnormal.fulfilled, (s, a) => {
        s.abnormalToday.loading = false;
        const payload = unwrapData(a.payload);
        s.abnormalToday.items = payload?.items ?? payload ?? [];
      })
      .addCase(fetchTodayAbnormal.rejected, (s, a) => {
        s.abnormalToday.loading = false;
        s.abnormalToday.error = a.error.message;
      })

      // TREND (per metric)
      .addCase(fetchTrend.pending, (s, a) => {
        const metricTypeId = a.meta.arg.metricTypeId;
        s.trend.loadingById[metricTypeId] = true;
        s.trend.errorById[metricTypeId] = null;
      })
      .addCase(fetchTrend.fulfilled, (s, a) => {
        const metricTypeId = a.payload.metricTypeId;
        const payload = unwrapData(a.payload.payload);
        s.trend.loadingById[metricTypeId] = false;
        s.trend.dataById[metricTypeId] = payload ?? null;
      })
      .addCase(fetchTrend.rejected, (s, a) => {
        const metricTypeId = a.meta.arg.metricTypeId;
        s.trend.loadingById[metricTypeId] = false;
        s.trend.errorById[metricTypeId] = a.error.message;
      });
  }
});

export const { clearTrendForMetric } = slice.actions;
export default slice.reducer;
