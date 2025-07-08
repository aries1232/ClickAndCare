import React, { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { assets } from '../assets/assets';

const DoctorSidebar = () => {
    const { setDToken, totalUnreadCount, getUnreadCounts, dToken } = useContext(DoctorContext);

    // Fetch unread counts immediately when sidebar mounts
    useEffect(() => {
        if (dToken) {
            getUnreadCounts();
        }
    }, [dToken, getUnreadCounts]);

    // Debug total unread count
    useEffect(() => {
        if (totalUnreadCount > 0) {
            console.log('DoctorSidebar: Total unread count:', totalUnreadCount);
        }
    }, [totalUnreadCount]);

    const handleLogout = () => {
        setDToken("");
        localStorage.removeItem("dToken");
    };

    const menuItems = [
        {
            path: "/doctor/dashboard",
            name: "Dashboard",
            icon: assets.home_icon,
        },
        {
            path: "/doctor/appointments",
            name: "Appointments",
            icon: assets.appointment_icon,
            showBadge: true,
        },
        {
            path: "/doctor/patients",
            name: "Patients",
            icon: assets.patient_icon,
        },
        {
            path: "/doctor/schedule",
            name: "Schedule",
            icon: assets.appointment_icon,
        },
        {
            path: "/doctor/profile",
            name: "Profile",
            icon: assets.people_icon,
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
                                        isActive ? "bg-gray-700 text-white border-r-2 border-green-500" : ""
                                    }`
                                }
                            >
                                <div className="relative">
                                    <img src={item.icon} alt="" className="w-5 h-5 mr-3" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                                    {item.showBadge && totalUnreadCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                                            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                                        </span>
                                    )}
                                </div>
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

export default DoctorSidebar; 