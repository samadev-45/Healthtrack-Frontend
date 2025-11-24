
import React from "react";

export default function MetricCard({ title, valueDisplay, unit, statusText, statusClass = "text-green-600", subText }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-600">{title}</div>
        <div className={`text-sm font-medium ${statusClass}`}>{statusText}</div>
      </div>

      <div className="text-3xl font-semibold">
        {valueDisplay} <span className="text-base font-normal text-gray-500"> {unit}</span>
      </div>

      {subText && <div className="text-xs text-gray-500 mt-2">{subText}</div>}
    </div>
  );
}
