import React, { useState } from 'react';
import { LockLeftIcon } from './AuthIcon.jsx';

const FOCUS_RING = {
  blue: 'focus:ring-blue-500',
  green: 'focus:ring-green-500',
  purple: 'focus:ring-purple-500',
};

const EyeOpen = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeClosed = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const PasswordField = ({ value, onChange, label = 'Password', placeholder = 'Enter your password', accent = 'blue', showToggle = true }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LockLeftIcon />
        </div>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className={`w-full pl-10 ${showToggle ? 'pr-12' : 'pr-3'} py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${FOCUS_RING[accent] || FOCUS_RING.blue}`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            {show ? <EyeClosed /> : <EyeOpen />}
          </button>
        )}
      </div>
    </div>
  );
};

export default PasswordField;
