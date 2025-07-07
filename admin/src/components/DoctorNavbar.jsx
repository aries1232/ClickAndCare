import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { DoctorContext } from "../context/DoctorContext.jsx";
import { toast } from "react-toastify";

const DoctorNavbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    setDToken(false);
    localStorage.removeItem("dToken");
    toast.success("Doctor logged out successfully");
    navigate('/doctor-login');
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 py-3 border-b border-gray-700 bg-gray-800">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-green-500">Doctor Panel</h1>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-300">Welcome, Doctor</span>
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

export default DoctorNavbar; 