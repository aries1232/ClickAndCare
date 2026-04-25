import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { HiX, HiOutlineUser, HiOutlineCalendar, HiOutlineLogout } from 'react-icons/hi';
import { assets } from '../../assets/assets.js';
import ProfileImage from '../ProfileImage.jsx';
import UnreadBadge from './UnreadBadge.jsx';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/doctors', label: 'Doctors' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const MobileMenu = ({ show, setShow, token, userData, totalUnreadCount, onMenuClick, onLogout, onLogin }) => {
  useEffect(() => {
    if (show) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  return (
    <div className={`md:hidden fixed inset-0 z-50 ${show ? '' : 'pointer-events-none'}`}>
      <div
        onClick={() => setShow(false)}
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-200 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 ${
          show ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
          <img className="h-12 w-auto" src={assets.logo} alt="ClickAndCare" />
          <button
            onClick={() => setShow(false)}
            className="p-2 -mr-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {token && userData && (
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
            <ProfileImage user={userData} />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">{userData.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData.email}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-2">
          {LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              onClick={() => setShow(false)}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-5 py-3 text-base font-medium border-l-4 transition-colors ${
                  isActive
                    ? 'border-primary text-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {token && userData && (
            <>
              <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
              <button
                onClick={() => { onMenuClick('profile'); setShow(false); }}
                className="w-full flex items-center gap-3 px-5 py-3 text-base text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <HiOutlineUser className="w-5 h-5 text-gray-500" />
                My Profile
              </button>
              <button
                onClick={() => { onMenuClick('appointments'); setShow(false); }}
                className="w-full flex items-center gap-3 px-5 py-3 text-base text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative"
              >
                <HiOutlineCalendar className="w-5 h-5 text-gray-500" />
                My Appointments
                {totalUnreadCount > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-red-500 text-white rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center">
                    {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                  </span>
                )}
              </button>
            </>
          )}
        </nav>

        <div className="p-5 border-t border-gray-100 dark:border-gray-800">
          {token && userData ? (
            <button
              onClick={() => { onLogout(); setShow(false); }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <HiOutlineLogout className="w-5 h-5" />
              Logout
            </button>
          ) : (
            <button
              onClick={() => { onLogin?.(); setShow(false); }}
              className="w-full px-5 py-3 text-sm font-semibold text-white bg-primary rounded-full shadow-sm shadow-primary/30 hover:bg-emerald-500 transition-colors"
            >
              Create Account
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

export default MobileMenu;
