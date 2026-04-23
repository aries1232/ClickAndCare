import React from 'react';

const AuthDivider = ({ label }) => (
  <div className="mt-6">
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300 dark:border-gray-700" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">{label}</span>
      </div>
    </div>
  </div>
);

export default AuthDivider;
