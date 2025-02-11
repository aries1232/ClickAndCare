import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { DoctorContext } from '../context/DoctorContext';

const Sidebar = () => {
    const { aToken } = useContext(AdminContext);
    const {dToken} = useContext(DoctorContext);

    return (
        <div className="h-screen bg-gray-50 border-r p-2 flex flex-col flex-none overflow-hidden 
                        w-[60px] min-w-[60px] max-w-[60px] md:w-[210px] md:min-w-[210px] 
                        sm:w-[180px] sm:min-w-[180px] transition-all duration-300">
            
            {aToken && (
                <ul className="space-y-1">
                    <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-primary text-white' : 'text-gray-800 hover:bg-green-200'}`
                        }
                    >
                        <img src={assets.home_icon} alt="Dashboard" className="w-6 h-6 flex-shrink-0" />
                        <p className="truncate hidden sm:block">Dashboard</p>
                    </NavLink>

                    <NavLink 
                        to="/all-appointments" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-primary text-white' : 'text-gray-800 hover:bg-green-200'}`
                        }
                    >
                        <img src={assets.appointment_icon} alt="Appointments" className="w-6 h-6 flex-shrink-0" />
                        <p className="truncate hidden sm:block">Appointments</p>
                    </NavLink>

                    <NavLink 
                        to="/add-doctor" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-primary text-white' : 'text-gray-800 hover:bg-green-200'}`
                        }
                    >
                        <img src={assets.add_icon} alt="Add Doctor" className="w-6 h-6 flex-shrink-0" />
                        <p className="truncate hidden sm:block">Add Doctor</p>
                    </NavLink>

                    <NavLink 
                        to="/doctor-list" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-primary text-white' : 'text-gray-800 hover:bg-green-200'}`
                        }
                    >
                        <img src={assets.people_icon} alt="All Doctors" className="w-6 h-6 flex-shrink-0" />
                        <p className="truncate hidden sm:block">All Doctors</p>
                    </NavLink>
                </ul>
            )}
            
            {dToken && (
                <ul className="space-y-1">
                    <NavLink 
                        to="/doctor-dashboard" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-primary text-white' : 'text-gray-800 hover:bg-green-200'}`
                        }
                    >
                        <img src={assets.home_icon} alt="Dashboard" className="w-6 h-6 flex-shrink-0" />
                        <p className="truncate hidden md:block">Dashboard</p>
                    </NavLink>

                    <NavLink 
                        to="/doctor-appointments" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-primary text-white' : 'text-gray-800 hover:bg-green-200'}`
                        }
                    >
                        <img src={assets.appointment_icon} alt="Appointments" className="w-6 h-6 flex-shrink-0" />
                        <p className="truncate hidden md:block">Appointments</p>
                    </NavLink>


                    <NavLink 
                        to="/doctor-profile" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-primary text-white' : 'text-gray-800 hover:bg-green-200'}`
                        }
                    >
                        <img src={assets.people_icon} alt="Profile" className="w-6 h-6 flex-shrink-0" />
                        <p className="truncate hidden md:block">Profile</p>
                    </NavLink>
                </ul>
            )}
        </div>
    );
}

export default Sidebar;
