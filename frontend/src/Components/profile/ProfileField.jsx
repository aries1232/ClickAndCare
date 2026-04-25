import React from 'react';

const ProfileField = ({ label, icon: Icon, children }) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/40 p-4 hover:border-primary/40 transition-colors duration-200">
    <div className="flex items-center gap-2 mb-2">
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      <label className="block text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
        {label}
      </label>
    </div>
    {children}
  </div>
);

export default ProfileField;
