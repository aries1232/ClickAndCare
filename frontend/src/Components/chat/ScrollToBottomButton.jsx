import React from 'react';

const ScrollToBottomButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 p-2 bg-gray-800/90 hover:bg-gray-700/90 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105"
    title="Scroll to bottom"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  </button>
);

export default ScrollToBottomButton;
