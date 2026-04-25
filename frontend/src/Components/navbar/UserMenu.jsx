import React, { useEffect, useRef } from 'react';
import { HiOutlineUser, HiOutlineCalendar, HiOutlineLogout, HiChevronDown } from 'react-icons/hi';
import ProfileImage from '../ProfileImage.jsx';
import UnreadBadge from './UnreadBadge.jsx';

const UserMenu = ({ userData, totalUnreadCount, show, setShow, onMenuClick, onLogout }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!show) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShow(false);
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setShow(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [show, setShow]);

  const firstName = (userData?.name || '').split(' ')[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setShow(!show)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-haspopup="menu"
        aria-expanded={show}
      >
        <div className="relative">
          <ProfileImage user={userData} />
          <UnreadBadge count={totalUnreadCount} />
        </div>
        <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[7rem] truncate">
          {firstName || 'Account'}
        </span>
        <HiChevronDown
          className={`hidden sm:inline w-4 h-4 text-gray-400 transition-transform duration-200 ${
            show ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        role="menu"
        className={`absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/5 overflow-hidden origin-top-right transition-all duration-150 ${
          show ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'
        }`}
      >
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/60 flex items-center gap-3">
          <ProfileImage user={userData} />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white truncate">{userData.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData.email}</p>
          </div>
        </div>

        <div className="py-1">
          <button
            onClick={() => onMenuClick('profile')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
          >
            <HiOutlineUser className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            My Profile
          </button>

          <button
            onClick={() => onMenuClick('appointments')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors relative"
          >
            <HiOutlineCalendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>My Appointments</span>
            {totalUnreadCount > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-red-500 text-white rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700/60 py-1">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
