// src/components/HealthValuesTable.jsx
import React from "react";

export default function HealthValuesTable({ values = {} }) {
  const keys = Object.keys(values || {});
  if (!keys.length) return <div className="text-sm text-gray-500">No health values recorded.</div>;

  return (
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead>
        <tr>
          <th className="px-3 py-2 text-left">Metric</th>
          <th className="px-3 py-2 text-left">Value</th>
        </tr>
      </thead>
      <tbody>
        {keys.map((k) => (
          <tr key={k} className="border-b">
            <td className="px-3 py-2">{k}</td>
            <td className="px-3 py-2">{values[k]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
