import React from 'react';

const AuthDivider = ({ label }) => (
  <div className="my-4 sm:my-5 relative">
    <div className="absolute inset-0 flex items-center" aria-hidden="true">
      <div className="w-full border-t border-gray-200 dark:border-gray-700" />
    </div>
    <div className="relative flex justify-center text-xs uppercase tracking-wider">
      <span className="px-3 bg-white dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 font-medium">
        {label}
      </span>
    </div>
  </div>
);

export default AuthDivider;
