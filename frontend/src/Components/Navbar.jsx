import React, { useContext, useState } from "react";
import  { assets } from "../assets/assets.js";
import { NavLink, useNavigate } from "react-router-dom";
import {AppContext }from '../context/AppContext'
import { toast } from "react-toastify";
const Navbar = () => {
  //naviage hook
  const navigate = useNavigate();
const {token,setToken,userData}= useContext(AppContext)
  //use state hook
  const [showMenu, setShowMenu] = useState(true);
  const logout =()=>{
    setToken(false)
    localStorage.removeItem('token')
    toast.success("Logged Out")
  }
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
        { token && userData ? (
         <div className="flex items-center gap-2 cursor-pointer relative group">
            <img className="w-10 rounded-full" src={userData.image} alt="Profile" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
               <div className="min-w-60 bg-stone-100 rounded-md flex flex-col gap-4 p-4">
               <p onClick={()=>navigate('/my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
               <p onClick={()=>navigate('/my-appointments')} className="hover:text-black cursor-pointer">My Appointments</p>
               <p onClick={logout} className="hover:text-black cursor-pointer">Logout</p>
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
        <img onClick={()=>setShowMenu(true)} className="w-6 md:hidden" src={assets.menu_icon} alt="" />
        {/* -----------------------Mobile Menu--------------------- */}
        <div className={`${showMenu ? 'fixed w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`} >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-52" src={assets.logo} alt="" />
            <img className="w-8" onClick={()=> setShowMenu()} src={assets.cross_icon} alt="" />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
              <NavLink onClick={()=>setShowMenu(false)} to="/"><p className="px-4 py-2 rounded inline-block">HOME</p></NavLink>
              <NavLink onClick={()=>setShowMenu(false)} to="/doctors"><p className="px-4 py-2 rounded inline-block">All DOCTORS</p></NavLink>
              <NavLink onClick={()=>setShowMenu(false)} to="/about"><p className="px-4 py-2 rounded inline-block">ABOUT</p></NavLink>
              <NavLink onClick={()=>setShowMenu(false)} to="/contact"><p className="px-4 py-2 rounded inline-block">Contact us</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
