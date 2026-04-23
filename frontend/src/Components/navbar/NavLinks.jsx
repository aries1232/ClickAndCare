import React from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'HOME' },
  { to: '/doctors', label: 'All DOCTORS' },
  { to: '/about', label: 'ABOUT' },
  { to: 'contact', label: 'Contact us' },
];

const NavLinks = () => (
  <ul className="hidden md:flex items-start gap-5 font-medium text-gray-600 dark:text-white">
    {LINKS.map(({ to, label }) => (
      <NavLink key={to} to={to} className="text-gray-600 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200">
        <li className="py-1">{label}</li>
        <hr className="border-none outline-none h-0.5 bg-primary w-4/5 m-auto hidden" />
      </NavLink>
    ))}
  </ul>
);

export default NavLinks;
