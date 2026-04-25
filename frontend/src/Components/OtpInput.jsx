import React from 'react';
import { isDigitsOnly } from '../utils/validators';

const OtpInput = ({ value, onChange, disabled = false, placeholder = 'Enter 6-digit OTP', id = 'otp', className = '' }) => {
  const handleChange = (e) => {
    const v = e.target.value;
    if (v.length <= 6 && isDigitsOnly(v)) onChange(v);
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="numeric"
      maxLength="6"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 outline-none bg-white dark:bg-gray-900 dark:text-white text-center text-lg font-semibold tracking-[0.5em] ${className}`}
    />
  );
};

export default OtpInput;
