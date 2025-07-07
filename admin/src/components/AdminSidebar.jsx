import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { assets } from '../assets/assets';

const AdminSidebar = () => {
  const { setAToken } = useContext(AdminContext);

  const handleLogout = () => {
    setAToken("");
    localStorage.removeItem("aToken");
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      name: "Dashboard",
      icon: assets.home_icon,
    },
    {
      path: "/admin/add-doctor",
      name: "Add Doctor",
      icon: assets.add_icon,
    },
    {
      path: "/admin/doctor-list",
      name: "Doctor List",
      icon: assets.people_icon,
    },
    {
      path: "/admin/all-appointments",
      name: "All Appointments",
      icon: assets.appointment_icon,
    },
    {
      path: "/admin/pending-doctors",
      name: "Pending Doctors",
      icon: assets.tick_icon,
    },
    {
      path: "/admin/settings",
      name: "Settings",
      icon: assets.home_icon,
    },
  ];

  return (
    <div className="bg-gray-800 h-screen w-64 fixed left-0 top-0 shadow-lg">
      <div className="h-24 border-b border-gray-700 flex items-center justify-center">
        <img
          className="w-full h-full object-contain p-1"
          src={assets.logo}
          alt="Logo"
        />
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
                    isActive ? "bg-gray-700 text-white border-r-2 border-red-500" : ""
                  }`
                }
              >
                <img src={item.icon} alt="" className="w-5 h-5 mr-3" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-4 left-0 right-0 px-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar; 