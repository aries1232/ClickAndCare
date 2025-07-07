import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { AdminContext } from "../context/AdminContext.jsx";

const AdminNavbar = () => {
  const { aToken } = useContext(AdminContext);

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 py-3 border-b border-gray-700 bg-gray-800">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-red-500">Admin Panel</h1>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-300">Welcome, Admin</span>
      </div>
    </div>
  );
};

export default AdminNavbar; 