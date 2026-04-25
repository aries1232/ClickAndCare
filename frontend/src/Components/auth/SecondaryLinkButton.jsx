import React from 'react';
import { useNavigate } from 'react-router-dom';

const SecondaryLinkButton = ({ to, children }) => {
  const navigate = useNavigate();
  return (
    <div className="mt-3 sm:mt-4">
      <button
        type="button"
        onClick={() => navigate(to)}
        className="w-full bg-white dark:bg-gray-900 ring-1 ring-gray-300 dark:ring-gray-700 text-gray-700 dark:text-gray-200 py-2.5 sm:py-3 px-4 text-sm sm:text-base rounded-full font-semibold hover:ring-primary/50 hover:text-primary dark:hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-all duration-200"
      >
        {children}
      </button>
    </div>
  );
};

export default SecondaryLinkButton;
