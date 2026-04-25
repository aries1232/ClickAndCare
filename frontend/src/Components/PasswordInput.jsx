import React from 'react';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { usePasswordToggle } from '../hooks/usePasswordToggle';

const PasswordInput = ({
  id = 'password',
  value,
  onChange,
  placeholder = 'Enter your password',
  required = true,
  disabled = false,
  name,
  className = '',
}) => {
  const { showPassword, toggleShowPassword } = usePasswordToggle();

  return (
    <div className={`relative ${className}`}>
      <span className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
        <HiOutlineLockClosed className="w-4 h-4 sm:w-5 sm:h-5" />
      </span>
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 outline-none bg-white dark:bg-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <HiOutlineEyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <HiOutlineEye className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>
    </div>
  );
};

export default PasswordInput;
