import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AdminContext } from "../context/AdminContext.jsx";
import { toast } from "react-toastify";

const AdminNavbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const logout = () => {
    setAToken(false);
    localStorage.removeItem("aToken");
    toast.success("Admin logged out successfully");
    navigate('/admin-login');
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 py-3 border-b border-gray-700 bg-gray-800">
      <div className="flex items-center gap-3">
        <img
          className="w-8 h-8"
          src={assets.logo}
          alt="Logo"
        />
        <h1 className="text-2xl font-bold text-red-500">Admin Panel</h1>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-300">Welcome, Admin</span>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar; 