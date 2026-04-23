import React from 'react';
import ProfileImage from '../ProfileImage.jsx';
import UnreadBadge from './UnreadBadge.jsx';

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AppointmentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const UserMenu = ({ userData, totalUnreadCount, show, setShow, onMenuClick, onLogout }) => (
  <div className="flex items-center gap-2 cursor-pointer relative group">
    <div
      className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="relative">
        <ProfileImage user={userData} />
        <UnreadBadge count={totalUnreadCount} />
      </div>
    </div>

    <div
      className={`absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden transition-all duration-200 ${
        show ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <p className="font-semibold text-gray-900 dark:text-white">{userData.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{userData.email}</p>
      </div>

      <div className="py-2">
        <button
          onClick={() => onMenuClick('profile')}
          className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-white hover:bg-primary hover:text-white transition-colors duration-200"
        >
          <UserIcon />My Profile
        </button>

        <button
          onClick={() => onMenuClick('appointments')}
          className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 dark:text-white hover:bg-primary hover:text-white transition-colors duration-200 relative"
        >
          <AppointmentIcon />My Appointments
          <UnreadBadge count={totalUnreadCount} />
        </button>

        <hr className="my-2 border-gray-100 dark:border-gray-700" />

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
        >
          <LogoutIcon />Logout
        </button>
      </div>
    </div>
  </div>
);

export default UserMenu;
