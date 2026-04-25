import React from 'react';
import { HiOutlineMail } from 'react-icons/hi';

const EmailInput = ({
  value,
  onChange,
  disabled = false,
  id = 'email',
  name = 'email',
  placeholder = 'you@example.com',
  className = '',
}) => (
  <div className={`relative ${className}`}>
    <span className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
      <HiOutlineMail className="w-4 h-4 sm:w-5 sm:h-5" />
    </span>
    <input
      id={id}
      name={name}
      type="email"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required
      className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 outline-none bg-white dark:bg-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
    />
  </div>
);

export default EmailInput;
