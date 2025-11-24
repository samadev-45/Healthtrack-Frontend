// src/components/TrendChart.jsx
import React from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine
} from "recharts";

export default function TrendChart({ trend }) {
  
  if (!trend) return <div className="p-4 text-gray-500">No trend data</div>;

  // Accept either camelCase or PascalCase keys
  const rawPoints = trend.points ?? trend.Points ?? [];
  const data = rawPoints.map(p => ({
    measuredAt: new Date(p.measuredAt ?? p.MeasuredAt).toLocaleDateString(),
    value: Number(p.value ?? p.Value),
    isAbnormal: p.isAbnormal ?? p.IsAbnormal
  }));

  const minValue = trend.minValue ?? trend.MinValue ?? null;
  const maxValue = trend.maxValue ?? trend.MaxValue ?? null;
  const displayName = trend.displayName ?? trend.DisplayName ?? "Metric";
  const unit = trend.unit ?? trend.Unit ?? "";

  return (
    <div className="bg-white rounded p-4 shadow-sm">
      <div className="mb-2">
        <div className="text-sm text-gray-600">{displayName}</div>
        <div className="text-lg font-semibold">{unit}</div>
      </div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="measuredAt" />
            <YAxis />
            <Tooltip />
            {minValue != null && (
              <ReferenceLine y={Number(minValue)} stroke="#f6c23e" strokeDasharray="3 3" label="Low" />
            )}
            {maxValue != null && (
              <ReferenceLine y={Number(maxValue)} stroke="#e74a3b" strokeDasharray="3 3" label="High" />
            )}
            <Line type="monotone" dataKey="value" stroke="#38bdf8" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
