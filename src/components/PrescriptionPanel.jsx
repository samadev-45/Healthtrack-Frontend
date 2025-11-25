// src/components/PrescriptionPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPrescription,
  addItem,
  editItem,
  removeItem,
  fetchOrCreatePrescription,
  clearPrescription,
} from "../store/prescriptionSlice";
import toast from "react-hot-toast";
import AddEditPrescriptionItem from "./AddEditPrescriptionItem";

export default function PrescriptionPanel({ consultationId }) {
  const dispatch = useDispatch();
  const prescription = useSelector((s) => s.prescription.data);
  const loading = useSelector((s) => s.prescription.loading);
  const user = useSelector((s) => s.auth.user);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // ⭐ FIX: Normalize API response shape
  const items =
    prescription?.items ??
    prescription?.prescriptionItems ??
    [];

  useEffect(() => {
    if (!consultationId) return;

    dispatch(fetchPrescription({ consultationId }))
      .unwrap?.()
      .catch(() => {});

    return () => dispatch(clearPrescription());
  }, [dispatch, consultationId]);

  const canEdit = useMemo(() => {
    if (!user) return false;
    const role = user.role ?? user.roleName ?? "";
    return String(role).toLowerCase() === "doctor";
  }, [user]);

  const handleCreateIfMissing = async () => {
    if (!consultationId) return;
    try {
      const dto = { notes: "Prescription created from UI." };
      await dispatch(fetchOrCreatePrescription({ consultationId, createDto: dto })).unwrap();
      toast.success("Prescription created.");
    } catch {
      toast.error("Failed to create prescription.");
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setModalOpen(false);
  };

  const onSave = async (itemDto) => {
    try {
      if (!prescription?.prescriptionId) {
        await handleCreateIfMissing();
      }

      if (editingItem) {
        await dispatch(
          editItem({
            consultationId,
            itemId: editingItem.prescriptionItemId ?? editingItem.PrescriptionItemId,
            item: itemDto,
          })
        ).unwrap();
        toast.success("Updated successfully.");
      } else {
        await dispatch(addItem({ consultationId, item: itemDto })).unwrap();
        toast.success("Added successfully.");
      }

      closeModal();
      dispatch(fetchPrescription({ consultationId }));
    } catch {
      toast.error("Operation failed.");
    }
  };

  const onDelete = async (item) => {
    try {
      const id = item.prescriptionItemId ?? item.PrescriptionItemId;
      await dispatch(removeItem({ consultationId, itemId: id })).unwrap();
      toast.success("Deleted.");
      dispatch(fetchPrescription({ consultationId }));
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">Prescription</h4>

        {canEdit && (
          <button onClick={openAdd} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
            Add Medication
          </button>
        )}
      </div>

      {loading && <div>Loading prescription...</div>}

      {!loading && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((pi) => {
            const id = pi.prescriptionItemId ?? pi.PrescriptionItemId;
            return (
              <li key={id} className="p-3 bg-gray-50 rounded flex justify-between items-start">
                <div>
                  <div className="font-medium">{pi.medicine ?? pi.Medicine}</div>
                  <div className="text-xs text-gray-600">
                    {pi.dose ?? pi.Dose} • {pi.frequency ?? pi.Frequency}{" "}
                    {pi.durationDays ? `• ${pi.durationDays} days` : ""}
                  </div>
                  {pi.notes && <div className="text-xs text-gray-500 mt-1">{pi.notes}</div>}
                </div>

                {canEdit && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(pi)} className="px-2 py-1 text-sm border rounded">
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
        !loading && <div className="text-sm text-gray-500">No prescription items.</div>
      )}

      <AddEditPrescriptionItem open={modalOpen} onClose={closeModal} onSave={onSave} item={editingItem} />
    </div>
  );
}
