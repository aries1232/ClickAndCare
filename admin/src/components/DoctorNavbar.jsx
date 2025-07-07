import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { DoctorContext } from "../context/DoctorContext.jsx";

const DoctorNavbar = () => {
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 py-3 border-b border-gray-700 bg-gray-800">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-green-500">Doctor Panel</h1>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-300">Welcome, Doctor</span>
      </div>
    </div>
  );
};

export default DoctorNavbar; 