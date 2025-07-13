import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../context/AdminContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { DoctorContext } from '../context/DoctorContext';

const Sidebar = () => {
    const { aToken } = useContext(AdminContext);
    const { dToken, totalUnreadCount, getUnreadCounts } = useContext(DoctorContext);

    // Fetch unread counts immediately when sidebar mounts (for doctors)
    useEffect(() => {
        if (dToken) {
            getUnreadCounts();
        }
    }, [dToken, getUnreadCounts]);



    return (
        <div className="h-screen bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 p-2 flex flex-col flex-none overflow-hidden 
                        w-[60px] min-w-[60px] max-w-[60px] md:w-[210px] md:min-w-[210px] 
                        sm:w-[180px] sm:min-w-[180px] transition-all duration-300">
            
            {aToken && (
                <ul className="space-y-1">
                    <NavLink 
                        to="/admin/dashboard" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-200 hover:bg-gray-700/50'}`
                        }
                    >
                        <img src={assets.home_icon} alt="Dashboard" className="w-6 h-6 flex-shrink-0" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                        <p className="truncate hidden sm:block">Dashboard</p>
                    </NavLink>

                    <NavLink 
                        to="/admin/all-appointments" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-200 hover:bg-gray-700/50'}`
                        }
                    >
                        <img src={assets.appointment_icon} alt="Appointments" className="w-6 h-6 flex-shrink-0" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                        <p className="truncate hidden sm:block">Appointments</p>
                    </NavLink>

                    <NavLink 
                        to="/admin/add-doctor" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-200 hover:bg-gray-700/50'}`
                        }
                    >
                        <img src={assets.add_icon} alt="Add Doctor" className="w-6 h-6 flex-shrink-0" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                        <p className="truncate hidden sm:block">Add Doctor</p>
                    </NavLink>

                    <NavLink 
                        to="/admin/pending-doctors" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-200 hover:bg-gray-700/50'}`
                        }
                    >
                        <img src={assets.tick_icon} alt="Pending Doctors" className="w-6 h-6 flex-shrink-0" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                        <p className="truncate hidden sm:block">Pending Doctors</p>
                    </NavLink>

                    <NavLink 
                        to="/admin/doctor-list" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-200 hover:bg-gray-700/50'}`
                        }
                    >
                        <img src={assets.people_icon} alt="All Doctors" className="w-6 h-6 flex-shrink-0" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
                        <p className="truncate hidden sm:block">All Doctors</p>
                    </NavLink>
                </ul>
            )}
            
            {dToken && (
                <ul className="space-y-1">
                    <NavLink 
                        to="/doctor/dashboard" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-green-600 text-white shadow-lg' : 'text-gray-200 hover:bg-gray-700/50'}`
                        }
                    >
                        <img src={assets.home_icon} alt="Dashboard" className="w-6 h-6 flex-shrink-0" />
                        <p className="truncate hidden sm:block">Dashboard</p>
                    </NavLink>

                    <NavLink 
                        to="/doctor/appointments" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-green-600 text-white shadow-lg' : 'text-gray-200 hover:bg-gray-700/50'}`
                        }
                    >
                        <div className="relative">
                            <img src={assets.appointment_icon} alt="Appointments" className="w-6 h-6 flex-shrink-0" />
                            {totalUnreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                                    {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                                </span>
                            )}
                        </div>
                        <p className="truncate hidden sm:block">Appointments</p>
                    </NavLink>

                    <NavLink 
                        to="/doctor/profile" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-green-600 text-white shadow-lg' : 'text-gray-200 hover:bg-gray-700/50'}`
                        }
                    >
                        <img src={assets.people_icon} alt="Profile" className="w-6 h-6 flex-shrink-0" />
                        <p className="truncate hidden sm:block">Profile</p>
                    </NavLink>
                </ul>
            )}
        </div>
    );
}

export default Sidebar;
