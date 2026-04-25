import React from 'react';
import { HiArrowDown } from 'react-icons/hi';

const ScrollToBottomButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute bottom-20 right-4 z-20 w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full shadow-lg ring-1 ring-gray-200 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
    title="Scroll to bottom"
    aria-label="Scroll to bottom"
  >
    <HiArrowDown className="w-4 h-4" />
  </button>
);

export default ScrollToBottomButton;
