import React from 'react';

const ProfileField = ({ label, children }) => (
  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
    {children}
  </div>
);

export default ProfileField;
