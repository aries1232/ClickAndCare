import React from 'react';
import { assets } from '../assets/assets.js';
import DarkModeToggle from './DarkModeToggle.jsx';
import NavLinks from './navbar/NavLinks.jsx';
import UserMenu from './navbar/UserMenu.jsx';
import MobileMenu from './navbar/MobileMenu.jsx';
import { useNavbar } from '../hooks/useNavbar';

const Navbar = () => {
  const nav = useNavbar();

  return (
    <div className="flex items-center justify-between text-sm py-0 mb-5 border-b border-b-gray-400 dark:border-gray-600 bg-white dark:bg-gray-900">
      <img onClick={nav.goHome} src={assets.logo} alt="Logo" className="w-auto h-20 cursor-pointer" />
      <NavLinks />

      <div className="flex items-center gap-4">
        <DarkModeToggle />

        {nav.token && nav.userData ? (
          <UserMenu
            userData={nav.userData}
            totalUnreadCount={nav.totalUnreadCount}
            show={nav.showUserMenu}
            setShow={nav.setShowUserMenu}
            onMenuClick={nav.handleUserMenuClick}
            onLogout={nav.logout}
          />
        ) : (
          <button
            onClick={nav.goToLogin}
            className="h-15 w-auto bg-primary py-3 px-7 items-center font-medium text-base rounded-full text-slate-50 hidden md:block hover:bg-green-600 transition-colors duration-200"
          >
            Create Account
          </button>
        )}

        <img onClick={() => nav.setShowMenu(true)} className="w-6 md:hidden" src={assets.menu_icon} alt="" />

        <MobileMenu
          show={nav.showMenu}
          setShow={nav.setShowMenu}
          token={nav.token}
          userData={nav.userData}
          totalUnreadCount={nav.totalUnreadCount}
          onMenuClick={nav.handleUserMenuClick}
          onLogout={nav.logout}
        />
      </div>
    </div>
  );
};

export default Navbar;
