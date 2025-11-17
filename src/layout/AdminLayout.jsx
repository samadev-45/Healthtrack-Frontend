import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";
import { logout } from "../api/auth";
import toast from "react-hot-toast";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const res = await logout();

    if (res.success) {
      dispatch(logoutUser()); 
      toast.success("Logged out successfully"); 
      navigate("/auth/login",{ replace:true }); 
    } else {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col">
        <h1 className="text-2xl font-bold mb-10 text-blue-600">Admin Panel</h1>

        <nav className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/adminDashboard")}
            className="text-left text-gray-700 hover:text-blue-600"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="text-left text-gray-700 hover:text-blue-600"
          >
            Users
          </button>

          <button
            onClick={handleLogout}
            className="text-left text-red-500 mt-auto"
          >
            Logout
          </button>
        </nav>
      </div>

    
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
