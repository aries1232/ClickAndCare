import React, { useState } from "react";
import  { assets } from "../assets/assets.js";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  //naviage hook
  const navigate = useNavigate();

  //use state hook
  const [showMenu, setShowMenu] = useState(true);
  const [token, setToken] = useState(true);

  return (
    <div className="flex items-center justify-between text-sm py-0 mb-5 border-b border-b-gray-400">
      <img onClick={()=>navigate('/')} src={assets.logo} alt="Logo" className="w-auto h-20 cursor-pointer" />
      <ul className="hidden md:flex items-start gap-5 font-medium text-gray-600">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none  outline-none h-0.5 bg-primary w-4/5 m-auto  hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">All DOCTORS</li>
          <hr className="border-none   outline-none h-0.5 bg-primary w-4/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none  outline-none h-0.5 bg-primary w-4/5 m-auto hidden" />
        </NavLink>
        <NavLink to="contact">
          <li className="py-1">Contact us</li>
          <hr className="border-none  outline-none h-0.5 bg-primary w-4/5 m-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {token ? (
         <div className="flex items-center gap-2 cursor-pointer relative group">
            <img className="w-10 rounded-full" src={assets.profile_pic} alt="Profile" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
               <div className="min-w-60 bg-stone-100 rounded-md flex flex-col gap-4 p-4">
               <p onClick={()=>navigate('/my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
               <p onClick={()=>navigate('/my-appointment')} className="hover:text-black cursor-pointer">My Appointments</p>
               <p onClick={()=>setToken(false)} className="hover:text-black cursor-pointer">Logout</p>
               </div>
         </div>
      </div>
        
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="h-15 w-auto bg-primary py-3 px-7 items-center font-medium text-base rounded-full text-slate-50 hidden md:block"
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
