import React from 'react';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { assets } from '../assets/assets.js';
import DarkModeToggle from './DarkModeToggle.jsx';
import NavLinks from './navbar/NavLinks.jsx';
import UserMenu from './navbar/UserMenu.jsx';
import MobileMenu from './navbar/MobileMenu.jsx';
import { useNavbar } from '../hooks/useNavbar';

const Navbar = () => {
  const nav = useNavbar();

  return (
    <header className="sticky top-0 z-40 -mx-4 sm:-mx-[10%] mb-6 bg-white/75 dark:bg-gray-900/75 backdrop-blur-md border-b border-gray-200/70 dark:border-gray-800">
      <div className="mx-4 sm:mx-[10%] flex items-center justify-between">
        <button
          onClick={nav.goHome}
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md"
          aria-label="ClickAndCare home"
        >
          <img src={assets.logo} alt="ClickAndCare" className="h-16 sm:h-16 lg:h-20 w-auto" />
        </button>

        <NavLinks />

        <div className="flex items-center gap-2 sm:gap-3">
          <DarkModeToggle />

          {nav.token && nav.userData ? (
            // Avatar dropdown is desktop-only. On mobile the same options
            // (My Profile / My Appointments / Logout) live inside the
            // hamburger drawer, so we hide the redundant avatar here to
            // keep the mobile navbar clean.
            <div className="hidden md:block">
              <UserMenu
                userData={nav.userData}
                totalUnreadCount={nav.totalUnreadCount}
                show={nav.showUserMenu}
                setShow={nav.setShowUserMenu}
                onMenuClick={nav.handleUserMenuClick}
                onLogout={nav.logout}
              />
            </div>
          ) : (
            <button
              onClick={nav.goToLogin}
              className="hidden md:inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-primary rounded-full shadow-sm shadow-primary/30 hover:bg-emerald-500 hover:shadow-md hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200"
            >
              Create Account
            </button>
          )}

          <button
            onClick={() => nav.setShowMenu(true)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full ring-1 ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:ring-primary/40 transition-colors"
            aria-label="Open menu"
          >
            <HiOutlineMenuAlt3 className="w-5 h-5" />
          </button>

          <MobileMenu
            show={nav.showMenu}
            setShow={nav.setShowMenu}
            token={nav.token}
            userData={nav.userData}
            totalUnreadCount={nav.totalUnreadCount}
            onMenuClick={nav.handleUserMenuClick}
            onLogout={nav.logout}
            onLogin={nav.goToLogin}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
