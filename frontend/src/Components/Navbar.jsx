import React, { useContext, useState, useEffect } from "react";
import  { assets } from "../assets/assets.js";
import { NavLink, useNavigate } from "react-router-dom";
import {AppContext }from '../context/AppContext'
import { useSocketContext } from '../context/SocketContext'
import { toast } from "react-toastify";
import DefaultAvatar from "../components/DefaultAvatar.jsx";
import DarkModeToggle from "./DarkModeToggle.jsx";
import axios from "axios";

const Navbar = () => {
  //naviage hook
  const navigate = useNavigate();
  const {token,setToken,userData, backendUrl}= useContext(AppContext)
  const { socket } = useSocketContext();
  //use state hook
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  
  const logout =()=>{
    setToken(false)
    localStorage.removeItem('token')
    toast.success("Logged Out")
    setShowUserMenu(false)
    navigate('/')
  }

  const handleUserMenuClick = (action) => {
    setShowUserMenu(false)
    if (action === 'profile') {
      navigate('/my-profile')
    } else if (action === 'appointments') {
      navigate('/my-appointments')
    }
  }

  // Fetch total unread count
  const getTotalUnreadCount = async () => {
    if (!token || !backendUrl) {
      // console.log('Navbar: Missing token or backendUrl, skipping unread count fetch');
      return;
    }
    
    if (!userData?._id) {
      // console.log('Navbar: User data not loaded yet, skipping unread count fetch');
      return;
    }
    
    try {
      // console.log('Navbar: Fetching unread counts for user:', userData._id);
      const { data } = await axios.get(backendUrl + "/api/user/unread-counts", {
        headers: { token },
      });
      if (data.success) {
        const total = Object.values(data.unreadCounts).reduce((sum, count) => sum + count, 0);
        setTotalUnreadCount(total);
        // console.log('Navbar: Fetched total unread count:', total, 'from unreadCounts:', data.unreadCounts);
      } else {
        // console.log('Navbar: Failed to fetch unread counts:', data.message);
        setTotalUnreadCount(0);
      }
    } catch (error) {
      // console.error('Navbar: Error fetching unread counts:', error);
      setTotalUnreadCount(0);
    }
  };

  // Listen for unread count updates and custom events
  useEffect(() => {
    const handleUnreadCountUpdate = (event) => {
      const { unreadCounts: newUnreadCounts } = event.detail;
      const currentUserId = userData?._id || userData?.id;
      
      // console.log('Navbar: Received unread count update:', { newUnreadCounts, currentUserId });
      
      if (newUnreadCounts && newUnreadCounts[currentUserId] !== undefined) {
        // Calculate new total from ALL appointment counts (not just current user's count)
        const newTotal = Object.values(newUnreadCounts).reduce((sum, count) => sum + count, 0);
        setTotalUnreadCount(newTotal);
        // console.log('Navbar: Updated total unread count to:', newTotal, 'from counts:', newUnreadCounts);
      }
    };

    const handleResetUnreadCount = (event) => {
      const { appointmentId } = event.detail;
      // console.log('Navbar: Received reset unread count event for appointment:', appointmentId);
      // Fetch fresh unread count from server to ensure accuracy
      getTotalUnreadCount();
    };

    // Listen for new messages to update unread count in real-time
    const handleNewMessage = (event) => {
      const { appointmentId, message } = event.detail;
      const currentUserId = userData?._id || userData?.id;
      
      // console.log('Navbar: Received new message:', { 
      //   appointmentId, 
      //   messageSender: message.sender, 
      //   currentUser: currentUserId,
      //   isFromOther: message.sender !== currentUserId
      // });
      
      // Only update unread count if message is from the other person
      if (message.sender !== currentUserId) {
        // console.log('Navbar: New message received, fetching updated total unread count');
        // Fetch the actual total unread count from server to ensure accuracy
        getTotalUnreadCount();
      }
    };

    window.addEventListener('unreadCountUpdate', handleUnreadCountUpdate);
    window.addEventListener('resetUnreadCount', handleResetUnreadCount);
    window.addEventListener('newMessage', handleNewMessage);
    
    return () => {
      window.removeEventListener('unreadCountUpdate', handleUnreadCountUpdate);
      window.removeEventListener('resetUnreadCount', handleResetUnreadCount);
      window.removeEventListener('newMessage', handleNewMessage);
    };
  }, [userData?._id, userData?.id, token, backendUrl]);

  // Fetch unread count when userData is loaded and set up periodic refresh
  useEffect(() => {
    if (token && backendUrl && userData?._id) {
      // console.log('Navbar: User data loaded, fetching unread counts...');
      getTotalUnreadCount();
      
      // Set up periodic refresh every 30 seconds to ensure sync
      const intervalId = setInterval(() => {
        // console.log('Navbar: Periodic unread count refresh');
        getTotalUnreadCount();
      }, 30000); // 30 seconds
      
      return () => clearInterval(intervalId);
    } else {
      // console.log('Navbar: Waiting for user data...', { 
      //   token: !!token, 
      //   backendUrl: !!backendUrl, 
      //   userId: userData?._id,
      //   userDataLoaded: !!userData 
      // });
    }
  }, [token, backendUrl, userData]);

  // Function to render profile image or default avatar
  const renderProfileImage = (size = 'w-10 h-10') => {
    if (userData?.image && userData.image !== '') {
      return (
        <img 
          className={`${size} rounded-full object-cover border-2 border-gray-200`} 
          src={userData.image} 
          alt="Profile"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    return <DefaultAvatar name={userData?.name} size={size} />;
  };

  return (
    <div className="flex items-center justify-between text-sm py-0 mb-5 border-b border-b-gray-400 dark:border-gray-600 bg-white dark:bg-gray-900">
      <img onClick={()=>navigate('/')} src={assets.logo} alt="Logo" className="w-auto h-20 cursor-pointer" />
      <ul className="hidden md:flex items-start gap-5 font-medium text-gray-600 dark:text-white">
        <NavLink to="/" className="text-gray-600 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200">
          <li className="py-1">HOME</li>
          <hr className="border-none  outline-none h-0.5 bg-primary w-4/5 m-auto  hidden" />
        </NavLink>
        <NavLink to="/doctors" className="text-gray-600 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200">
          <li className="py-1">All DOCTORS</li>
          <hr className="border-none   outline-none h-0.5 bg-primary w-4/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about" className="text-gray-600 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200">
          <li className="py-1">ABOUT</li>
          <hr className="border-none  outline-none h-0.5 bg-primary w-4/5 m-auto hidden" />
        </NavLink>
        <NavLink to="contact" className="text-gray-600 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200">
          <li className="py-1">Contact us</li>
          <hr className="border-none  outline-none h-0.5 bg-primary w-4/5 m-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        <DarkModeToggle />
        { token && userData ? (
         <div className="flex items-center gap-2 cursor-pointer relative group">
            <div 
              className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <div className="relative">
                {renderProfileImage()}
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                  </span>
                )}
              </div>
            </div>
            
            {/* User Menu Dropdown */}
            <div 
              className={`absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden transition-all duration-200 ${
                showUserMenu ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white">{userData.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{userData.email}</p>
              </div>
              
              {/* Menu Options */}
              <div className="py-2">
                <button
                  onClick={() => handleUserMenuClick('profile')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-white hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </button>
                
                <button
                  onClick={() => handleUserMenuClick('appointments')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-white hover:bg-primary hover:text-white transition-colors duration-200 relative"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  My Appointments
                  {totalUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                      {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                    </span>
                  )}
                </button>
                
                <hr className="my-2 border-gray-100 dark:border-gray-700" />
                
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="h-15 w-auto bg-primary py-3 px-7 items-center font-medium text-base rounded-full text-slate-50 hidden md:block hover:bg-green-600 transition-colors duration-200"
          >
            Create Account
          </button>
        )}
        
        <img onClick={()=>setShowMenu(true)} className="w-6 md:hidden" src={assets.menu_icon} alt="" />
        
        {/* -----------------------Mobile Menu--------------------- */}
        <div className={`${showMenu ? 'fixed w-full':'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white dark:bg-gray-800 transition-all`} >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-52" src={assets.logo} alt="" />
            <img className="w-8" onClick={()=> setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium dark:text-white">
              <NavLink onClick={()=>setShowMenu(false)} to="/" className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200"><p className="px-4 py-2 rounded inline-block">HOME</p></NavLink>
              <NavLink onClick={()=>setShowMenu(false)} to="/doctors" className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200"><p className="px-4 py-2 rounded inline-block">All DOCTORS</p></NavLink>
              <NavLink onClick={()=>setShowMenu(false)} to="/about" className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200"><p className="px-4 py-2 rounded inline-block">ABOUT</p></NavLink>
              <NavLink onClick={()=>setShowMenu(false)} to="/contact" className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200"><p className="px-4 py-2 rounded inline-block">Contact us</p></NavLink>
              
              {/* Mobile User Menu */}
              {token && userData && (
                <>
                  <hr className="w-full border-gray-200 dark:border-gray-700 my-2" />
                  <div className="w-full">
                    <div className="flex items-center gap-3 px-4 py-2 mb-2">
                      {renderProfileImage('w-8 h-8')}
                      <span className="font-medium text-gray-900 dark:text-white">{userData.name}</span>
                    </div>
                    <button 
                      onClick={() => { handleUserMenuClick('profile'); setShowMenu(false); }}
                      className="w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-primary hover:text-white rounded transition-colors duration-200"
                    >
                      My Profile
                    </button>
                    <button 
                      onClick={() => { handleUserMenuClick('appointments'); setShowMenu(false); }}
                      className="w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-primary hover:text-white rounded transition-colors duration-200 relative"
                    >
                      My Appointments
                      {totalUnreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                          {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                        </span>
                      )}
                    </button>
                    <button 
                      onClick={() => { logout(); setShowMenu(false); }}
                      className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
