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
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 py-3 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <div className="flex items-center gap-1">
        <div className="border border-gray-500 px-2 py-0.5 rounded-full text-[10px] leading-none bg-gray-700 text-gray-200">
          {aToken ? <p>admin</p> : <p>doctor</p>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
