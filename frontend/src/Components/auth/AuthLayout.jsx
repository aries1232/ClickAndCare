import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineCheckCircle,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
} from 'react-icons/hi';
import logo from '../../assets/logo.png';

const PERKS = [
  { icon: HiOutlineCheckCircle, label: '100+ verified specialists' },
  { icon: HiOutlineSparkles, label: 'Book in under a minute' },
  { icon: HiOutlineHeart, label: 'Chat with your doctor 24/7' },
  { icon: HiOutlineShieldCheck, label: 'End-to-end encrypted' },
];

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
    {/* ─── Left: brand panel (lg+) ─────────────────────── */}
    <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-emerald-500 to-teal-600 text-white p-12 flex-col justify-between">
      <div className="absolute -top-32 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <Link to="/" className="relative inline-flex items-center gap-2 group">
        <img src={logo} alt="Click&Care" className="h-12 w-auto bg-white/95 rounded-md p-1 shadow-lg" />
      </Link>

      <div className="relative">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/85 mb-4">
          Healthcare, simplified
        </p>
        <h2 className="text-4xl xl:text-5xl font-extrabold leading-[1.05] tracking-tight">
          Your doctor is{' '}
          <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
            one tap away.
          </span>
        </h2>
        <p className="mt-5 max-w-md text-base text-white/85 leading-relaxed">
          Book appointments, chat with verified specialists, and keep every prescription, receipt and follow-up in one place.
        </p>

        <ul className="mt-8 space-y-3">
          {PERKS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-sm text-white/90">
              <span className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
                <Icon className="w-4 h-4" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/70">
        © {new Date().getFullYear()} Click&Care
      </p>
    </aside>

    {/* ─── Right: form panel ──────────────────────────── */}
    <main className="flex-1 flex items-start sm:items-center justify-center pt-6 px-3 pb-6 sm:p-8">
      <div className="w-full max-w-md">
        {/* Tablet-only logo: hidden on phones (cleaner mobile auth form) and
            on lg+ where the side brand panel already shows the logo. */}
        <div className="hidden sm:block lg:hidden text-center mb-6">
          <Link to="/" className="inline-block">
            <img src={logo} alt="Click&Care" className="h-20 w-auto mx-auto" />
          </Link>
        </div>

        <div className="text-center lg:text-left mb-4 sm:mb-6">
          <p className="inline-block text-[10px] sm:text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
            Account
          </p>
          <h1 className="mt-2 sm:mt-3 text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800/60 rounded-xl sm:rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 p-4 sm:p-8">
          {children}
        </div>
      </div>
    </main>
  </div>
);

export default AuthLayout;
