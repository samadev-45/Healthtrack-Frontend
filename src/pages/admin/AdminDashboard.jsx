import { useEffect, useState } from "react";
import { getPendingUsers, toggleUserStatus } from "../../api/admin";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getPendingUsers();
      setUsers(res);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await toggleUserStatus(id, "Approved");
      toast.success("User approved");
      loadUsers();
    } catch (err) {
      toast.error("Failed to approve user");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await toggleUserStatus(id, "Rejected");
      toast.success("User rejected");
      loadUsers();
    } catch (err) {
      toast.error("Failed to reject user");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No pending users.</p>
      ) : (
        <table className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.userId} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.fullName}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 font-semibold">{u.status}</td>

                <td className="p-3 flex gap-3 justify-center">
                  {/* Approve Button */}
                  <button
                    onClick={() => handleApprove(u.userId)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    Approve
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => handleReject(u.userId)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
