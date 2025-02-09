import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { AdminContext } from "../context/AdminContext.jsx";
import { DoctorContext } from "../context/DoctorContext.jsx";
import { toast } from "react-toastify";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    if (aToken) {
      setAToken(false);
      localStorage.removeItem("aToken");
    } else if (dToken) {
      setDToken(false);
      localStorage.removeItem("dToken");
    }
    toast.success("Logged Out");
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 py-3 border-b border-gray-500">
      <div className="flex items-center gap-3">
        <img
          className="w-12 sm:w-20 md:w-24 lg:w-28 xl:w-32 max-w-full h-auto cursor-pointer"
          src={assets.logo}
          alt="Logo"
        />
        <div className="border border-gray-500 px-3 py-1 rounded-full text-sm">
          {aToken ? <p>admin</p> : <p>doctor</p>}
        </div>
      </div>

      <button
        onClick={logout}
        className="text-white text-sm px-6 sm:px-10 py-2 rounded-full bg-primary"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
