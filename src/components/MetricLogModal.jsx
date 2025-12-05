// src/components/MetricLogModal.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  postMetric,
  fetchMyMetrics,
  fetchTrend,
} from "../store/healthMetricsSlice";
import toast from "react-hot-toast";

export default function MetricLogModal({
  metricTypes = [],
  open,
  onClose,
  defaultMetricTypeId,
}) {
  const dispatch = useDispatch();

  const resolveMetricTypeId = () =>
    defaultMetricTypeId ??
    metricTypes[0]?.MetricTypeId ??
    metricTypes[0]?.metricTypeId ??
    null;

  const [metricTypeId, setMetricTypeId] = useState(resolveMetricTypeId());
  const [value, setValue] = useState("");
  const [measuredAt, setMeasuredAt] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  /** Reset when modal opens */
  useEffect(() => {
    if (open) {
      setMetricTypeId(resolveMetricTypeId());
      setValue("");
      setNotes("");
      setMeasuredAt(new Date().toISOString().slice(0, 16));
    }
  }, [open, metricTypes, defaultMetricTypeId]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!metricTypeId) {
      toast.error("Please select a metric.");
      return;
    }

    const payload = {
      MetricTypeId: Number(metricTypeId),
      Value: Number(value),
      MeasuredAt: measuredAt ? new Date(measuredAt).toISOString() : undefined,
      Notes: notes || null,
    };

    try {
      setSaving(true);

      await dispatch(postxMetric(payload)).unwrap();

      // Refresh both list + trend
      dispatch(fetchMyMetrics({ page: 1, pageSize: 50 }));
      dispatch(fetchTrend({ metricTypeId: Number(metricTypeId), days: 30 }));

      toast.success("Vital logged successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save metric");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-5 rounded shadow"
      >
        <h3 className="text-lg font-medium mb-3">Log Vital Sign</h3>

        {/* Metric selection */}
        <label className="block text-sm text-gray-600">Metric</label>
        <select
          value={metricTypeId ?? ""}
          onChange={(e) => setMetricTypeId(Number(e.target.value))}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="" disabled>
            Select a metric
          </option>

          {metricTypes.map((m) => {
            const id = m.MetricTypeId ?? m.metricTypeId;
            const name = m.DisplayName ?? m.displayName;
            return (
              <option key={id} value={id}>
                {name}
              </option>
            );
          })}
        </select>

        {/* Value */}
        <label className="block text-sm text-gray-600">Value</label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          className="w-full p-2 border rounded mb-3"
        />

        {/* Timestamp */}
        <label className="block text-sm text-gray-600">Measured at</label>
        <input
          type="datetime-local"
          value={measuredAt}
          onChange={(e) => setMeasuredAt(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        {/* Notes */}
        <label className="block text-sm text-gray-600">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
