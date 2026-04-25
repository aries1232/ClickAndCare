import React from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/doctors', label: 'Doctors' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const NavLinks = () => (
  <nav className="hidden md:flex items-center gap-1">
    {LINKS.map(({ to, label, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) =>
          `relative px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            isActive
              ? 'text-primary'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span>{label}</span>
            <span
              className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-primary transition-all duration-200 ${
                isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}
              aria-hidden="true"
            />
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

export default NavLinks;
