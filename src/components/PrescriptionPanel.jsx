// src/components/PrescriptionPanel.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrCreatePrescription,
  addItem,
  editItem,
  removeItem,
  clearPrescription,
} from "../store/prescriptionSlice";
import toast from "react-hot-toast";
import AddEditPrescriptionItem from "./AddEditPrescriptionItem";

export default function PrescriptionPanel({ consultationId }) {
  const dispatch = useDispatch();

  const { data: prescription, loading } = useSelector((s) => s.prescription);
  const auth = useSelector((s) => s.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  /** Normalize items from BE */
  const items =
    prescription?.items ??
    prescription?.prescriptionItems ??
    [];

  /** Load prescription (GET only) */
  useEffect(() => {
    if (!consultationId) return;

    dispatch(fetchOrCreatePrescription({ consultationId }));

    return () => {
      dispatch(clearPrescription());
    };
  }, [consultationId]);

  /** Check if doctor */
  const canEdit = useMemo(() => {
    const role = auth.role ?? "";
    return String(role).toLowerCase() === "doctor";
  }, [auth.role]);

  /** Ensure prescription exists before adding items */
  const ensurePrescriptionExists = async () => {
    if (prescription?.prescriptionId) return;

    try {
      await dispatch(
        fetchOrCreatePrescription({
          consultationId,
          createDto: { notes: "Auto-created by system" },
        })
      ).unwrap();

      toast.success("Prescription created");
    } catch {
      toast.error("Failed to create prescription");
    }
  };

  /** Open modal to add item */
  const openAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  /** Open modal to edit item */
  const openEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  /** Close modal */
  const closeModal = () => {
    setEditingItem(null);
    setModalOpen(false);
  };

  /** Save Add/Edit */
  const onSave = async (itemDto) => {
    try {
      await ensurePrescriptionExists();

      if (editingItem) {
        // UPDATE
        const id =
          editingItem.prescriptionItemId ??
          editingItem.PrescriptionItemId;

        await dispatch(
          editItem({
            consultationId,
            itemId: id,
            item: itemDto,
          })
        ).unwrap();

        toast.success("Updated successfully");
      } else {
        // ADD
        await dispatch(addItem({ consultationId, item: itemDto })).unwrap();
        toast.success("Added successfully");
      }

      closeModal();
    } catch {
      toast.error("Operation failed");
    }
  };

  /** Delete item */
  const onDelete = async (item) => {
    try {
      const id =
        item.prescriptionItemId ??
        item.PrescriptionItemId;

      await dispatch(removeItem({ consultationId, itemId: id })).unwrap();

      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">Prescription</h4>

        {canEdit && (
          <button
            onClick={openAdd}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
            Add Medication
          </button>
        )}
      </div>

      {/* LOADING */}
      {loading && <div>Loading prescription...</div>}

      {/* ITEMS */}
      {!loading && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((pi) => {
            const id =
              pi.prescriptionItemId ??
              pi.PrescriptionItemId;

            return (
              <li
                key={id}
                className="p-3 bg-gray-50 rounded flex justify-between items-start"
              >
                <div>
                  <div className="font-medium">
                    {pi.medicine ?? pi.Medicine}
                  </div>

                  <div className="text-xs text-gray-600">
                    {pi.dose ?? pi.Dose} • {pi.frequency ?? pi.Frequency}{" "}
                    {pi.durationDays ? `• ${pi.durationDays} days` : ""}
                  </div>

                  {pi.notes && (
                    <div className="text-xs text-gray-500 mt-1">
                      {pi.notes}
                    </div>
                  )}
                </div>

                {canEdit && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(pi)}
                      className="px-2 py-1 text-sm border rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(pi)}
                      className="px-2 py-1 text-sm border rounded text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        !loading && (
          <div className="text-sm text-gray-500">
            No prescription items.
          </div>
        )
      )}

      {/* MODAL */}
      <AddEditPrescriptionItem
        open={modalOpen}
        onClose={closeModal}
        onSave={onSave}
        item={editingItem}
      />
    </div>
  );
}
