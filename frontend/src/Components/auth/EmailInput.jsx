import React from 'react';

const EmailInput = ({ value, onChange, disabled = false, id = 'email', placeholder = 'Enter your email', className = '' }) => (
  <input
    id={id}
    type="email"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    required
    className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none bg-white dark:bg-gray-900 dark:text-white ${className}`}
  />
);

export default EmailInput;
