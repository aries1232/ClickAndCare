import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets.js';
import ProfileImage from '../ProfileImage.jsx';
import UnreadBadge from './UnreadBadge.jsx';

const LINKS = [
  { to: '/', label: 'HOME' },
  { to: '/doctors', label: 'All DOCTORS' },
  { to: '/about', label: 'ABOUT' },
  { to: '/contact', label: 'Contact us' },
];

const MobileMenu = ({ show, setShow, token, userData, totalUnreadCount, onMenuClick, onLogout }) => (
  <div className={`${show ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white dark:bg-gray-800 transition-all`}>
    <div className="flex items-center justify-between px-5 py-6">
      <img className="w-52" src={assets.logo} alt="" />
      <img className="w-8" onClick={() => setShow(false)} src={assets.cross_icon} alt="" />
    </div>

    <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium dark:text-white">
      {LINKS.map(({ to, label }) => (
        <NavLink
          key={to}
          onClick={() => setShow(false)}
          to={to}
          className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200"
        >
          <p className="px-4 py-2 rounded inline-block">{label}</p>
        </NavLink>
      ))}

      {token && userData && (
        <>
          <hr className="w-full border-gray-200 dark:border-gray-700 my-2" />
          <div className="w-full">
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <ProfileImage user={userData} size="w-8 h-8" />
              <span className="font-medium text-gray-900 dark:text-white">{userData.name}</span>
            </div>
            <button
              onClick={() => { onMenuClick('profile'); setShow(false); }}
              className="w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-primary hover:text-white rounded transition-colors duration-200"
            >
              My Profile
            </button>
            <button
              onClick={() => { onMenuClick('appointments'); setShow(false); }}
              className="w-full text-left px-4 py-2 text-gray-700 dark:text-white hover:bg-primary hover:text-white rounded transition-colors duration-200 relative"
            >
              My Appointments
              <UnreadBadge count={totalUnreadCount} />
            </button>
            <button
              onClick={() => { onLogout(); setShow(false); }}
              className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </ul>
  </div>
);

export default MobileMenu;
