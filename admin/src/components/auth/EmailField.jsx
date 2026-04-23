import React from 'react';
import { EmailLeftIcon } from './AuthIcon.jsx';

const FOCUS_RING = {
  blue: 'focus:ring-blue-500',
  green: 'focus:ring-green-500',
  purple: 'focus:ring-purple-500',
};

const EmailField = ({ value, onChange, placeholder = 'your@email.com', label = 'Email Address', accent = 'blue', disabled = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-200 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <EmailLeftIcon />
      </div>
      <input
        type="email"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        disabled={disabled}
        className={`w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${FOCUS_RING[accent] || FOCUS_RING.blue}`}
      />
    </div>
  </div>
);

export default EmailField;
