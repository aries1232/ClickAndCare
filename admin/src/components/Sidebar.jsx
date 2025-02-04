import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
    const { aToken } = useContext(AdminContext);

    return (
        <div className="h-screen bg-gray-50 border-r p-2 flex flex-col flex-none overflow-hidden 
                        w-[250px] min-w-[250px] max-w-[250px] md:w-[180px] md:min-w-[180px] 
                        sm:w-[60px] sm:min-w-[60px] transition-all duration-300">
            
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
                        <p className="truncate sm:hidden md:block">Dashboard</p>
                    </NavLink>

                    <NavLink 
                        to="/all-appointments" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-primary text-white' : 'text-gray-800 hover:bg-green-200'}`
                        }
                    >
                        <img src={assets.appointment_icon} alt="Appointments" className="w-6 h-6 flex-shrink-0" />
                        <p className="truncate sm:hidden md:block">All Appointments</p>
                    </NavLink>

                    <NavLink 
                        to="/add-doctor" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-primary text-white' : 'text-gray-800 hover:bg-green-200'}`
                        }
                    >
                        <img src={assets.add_icon} alt="Add Doctor" className="w-6 h-6 flex-shrink-0" />
                        <p className="truncate sm:hidden md:block">Add Doctor</p>
                    </NavLink>

                    <NavLink 
                        to="/doctor-list" 
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-all w-full 
                            ${isActive ? 'bg-primary text-white' : 'text-gray-800 hover:bg-green-200'}`
                        }
                    >
                        <img src={assets.people_icon} alt="All Doctors" className="w-6 h-6 flex-shrink-0" />
                        <p className="truncate sm:hidden md:block">All Doctors</p>
                    </NavLink>
                </ul>
            )}
        </div>
    );
}

export default Sidebar;
