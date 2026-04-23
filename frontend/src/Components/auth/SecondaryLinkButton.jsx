import React from 'react';
import { useNavigate } from 'react-router-dom';

const SecondaryLinkButton = ({ to, children }) => {
  const navigate = useNavigate();
  return (
    <div className="mt-6">
      <button
        onClick={() => navigate(to)}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
      >
        {children}
      </button>
    </div>
  );
};

export default SecondaryLinkButton;
