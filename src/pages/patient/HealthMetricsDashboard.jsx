// src/pages/patient/HealthMetricsDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyMetrics, fetchTodayAbnormal, fetchTrend } from "../../store/healthMetricsSlice";
import MetricCard from "../../components/MetricCard";
import TrendChart from "../../components/TrendChart";
import MetricLogModal from "../../components/MetricLogModal";
import { getMyMetrics } from "../../api/healthmetrics";

export default function HealthMetricsDashboard() {
  const dispatch = useDispatch();
  const listState = useSelector((s) => s.healthMetrics.list);
  const abnormalState = useSelector((s) => s.healthMetrics.abnormalToday);
  const trendState = useSelector((s) => s.healthMetrics.trend);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState(null);
  const [metricTypes, setMetricTypes] = useState([]);

  // static metric types (prefer: fetch from MetricType endpoint if you add one)
  useEffect(() => {
    setMetricTypes([
      { MetricTypeId: 1, MetricCode: "bp_sys", DisplayName: "Systolic", Unit: "mmHg", MinValue: 80, MaxValue: 120 },
      { MetricTypeId: 2, MetricCode: "bp_dia", DisplayName: "Diastolic", Unit: "mmHg", MinValue: 60, MaxValue: 80 },
      { MetricTypeId: 3, MetricCode: "glucose_fast", DisplayName: "Glucose (Fasting)", Unit: "mg/dL", MinValue: 70, MaxValue: 100 },
      { MetricTypeId: 4, MetricCode: "glucose_pp", DisplayName: "Glucose (Postprandial)", Unit: "mg/dL", MinValue: 70, MaxValue: 140 },
      { MetricTypeId: 5, MetricCode: "spo2", DisplayName: "SpO2", Unit: "%", MinValue: 95, MaxValue: null },
      { MetricTypeId: 6, MetricCode: "heart_rate", DisplayName: "Heart Rate", Unit: "bpm", MinValue: 60, MaxValue: 100 }
    ]);
  }, []);

  // fetch metrics & abnormal list
  useEffect(() => {
    dispatch(fetchMyMetrics({ page: 1, pageSize: 50 }));
    dispatch(fetchTodayAbnormal());
  }, [dispatch]);

  // fetch trends for visible metric types (call once after metricTypes are available)
  useEffect(() => {
    if (!metricTypes || metricTypes.length === 0) return;
    // fetch for primary metrics you'd like to show charts for
    [1, 2, 3].forEach((mtid) => {
      dispatch(fetchTrend({ metricTypeId: mtid, days: 30 }));
    });
  }, [dispatch, metricTypes]);

  // map latest metrics by type (first item = newest because slice sorted)
  const latestByType = useMemo(() => {
    const map = {};
    (listState.items ?? []).forEach((m) => {
      const id = m.metricTypeId ?? m.MetricTypeId;
      if (!map[id]) map[id] = m;
    });
    return map;
  }, [listState.items]);

  const bpSys = latestByType[1];
  const bpDia = latestByType[2];
  const glucoseFasting = latestByType[3];
  const glucosePP = latestByType[4];

  const openModal = (metricTypeId = null) => {
    setSelectedMetricType(metricTypeId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
const getStatus = (value, metricType) => {
  if (value == null || !metricType) 
    return { text: "Normal", class: "text-green-600" };

  const min = metricType.MinValue;
  const max = metricType.MaxValue;

  if (min != null && value < min) return { text: "Low", class: "text-yellow-600" };
  if (max != null && value > max) return { text: "High", class: "text-red-600" };

  return { text: "Normal", class: "text-green-600" };
};

const bpStatusSys = getStatus(bpSys?.value, metricTypes.find(m => m.MetricTypeId === 1));
const bpStatusDia = getStatus(bpDia?.value, metricTypes.find(m => m.MetricTypeId === 2));

const finalBpStatus =
  (bpStatusSys.text !== "Normal" || bpStatusDia.text !== "Normal")
    ? "Abnormal"
    : "Normal";

const finalBpClass =
  finalBpStatus === "Normal" ? "text-green-600" : "text-red-600";

const glucoseValue =
  glucoseFasting?.value ??
  glucosePP?.value ??
  null;

const glucoseType = glucoseFasting
  ? metricTypes.find(m => m.MetricTypeId === 3)
  : metricTypes.find(m => m.MetricTypeId === 4);

const glucoseStatus = getStatus(glucoseValue, glucoseType);


  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Health Metrics</h2>
          <p className="text-sm text-gray-500">Track and monitor your vital health metrics</p>
        </div>
        <div>
          <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded">Log Vital Signs</button>
        </div>
      </div>

      {/* top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
  title="Blood Pressure"
  valueDisplay={
  bpSys?.value != null && bpDia?.value != null
    ? `${bpSys.value}/${bpDia.value}`
    : "--/--"
}

  unit="mmHg"
  statusText={finalBpStatus}
  statusClass={finalBpClass}
  subText="Normal range"


        />

        <MetricCard
  title="Blood Glucose"
  valueDisplay={glucoseValue ?? "--"}
  unit="mg/dL"
  statusText={glucoseStatus.text}
  statusClass={glucoseStatus.class}
  subText="Normal range"
/>


        <MetricCard
          title="Weight"
          valueDisplay="69.2"
          unit="kg"
          statusText="Stable"
          subText="-0.8 kg this week"
        />
      </div>

      {/* trends: two example charts (systolic and diastolic) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <TrendChart trend={trendState.dataById[1] ?? null} />
        </div>

        <div>
          <TrendChart trend={trendState.dataById[2] ?? null} />
        </div>
      </div>

      <MetricLogModal
        metricTypes={metricTypes}
        open={modalOpen}
        onClose={closeModal}
        defaultMetricTypeId={selectedMetricType}
      />
    </div>
  );
}
