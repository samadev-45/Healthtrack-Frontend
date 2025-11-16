import { useEffect, useState } from "react";
import { getPendingUsers, toggleUserStatus } from "../../api/admin";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  const [roleTab, setRoleTab] = useState("Patient");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getPendingUsers(); // returns ALL pending users
  
      setAllUsers(res);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // FILTER + SEARCH + PAGINATION
  useEffect(() => {
    let data = [...allUsers];

    // Filter by role
    data = data.filter(
      (u) => u.role?.toLowerCase() === roleTab.toLowerCase()
    );

    // Search
    if (searchText.trim() !== "") {
      data = data.filter(
        (u) =>
          u.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          u.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      data = data.filter((u) => u.status === statusFilter);
    }

    setFilteredUsers(data);
    setPage(1);
  }, [allUsers, roleTab, searchText, statusFilter]);

  const handleStatusChange = async (id) => {
    try {
      const res = await toggleUserStatus(id);
      toast.success(res.message);
      loadUsers();
    } catch {
      toast.error("Failed to update");
    }
  };

  const paginated = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {/* ROLE TABS */}
      <div className="flex gap-4 mb-6">
        {["Patient", "Doctor", "Caretaker"].map((r) => (
          <button
            key={r}
            className={`px-4 py-2 rounded-lg border 
            ${roleTab === r ? "bg-blue-600 text-white" : "bg-white"}`}
            onClick={() => setRoleTab(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search name or email"
          className="px-4 py-2 rounded-lg border w-1/3"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-lg border"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* USERS TABLE */}
      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : paginated.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            paginated.map((u) => (
              <tr key={u.userId} className="border-b">
                <td className="p-3">{u.fullName}</td>
                <td className="p-3">{u.email}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${u.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : u.status === "Approved"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                      }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleStatusChange(u.userId)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleStatusChange(u.userId)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-center mt-4 gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <button
          disabled={page * ITEMS_PER_PAGE >= filteredUsers.length}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
