import React from 'react';

const ACCENT = {
  blue: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/25',
  green: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-green-500/25',
  purple: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-purple-500/25',
};

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const SubmitButton = ({ loading, disabled, loadingText = 'Loading...', accent = 'blue', children }) => (
  <button
    type="submit"
    disabled={loading || disabled}
    className={`w-full bg-gradient-to-r ${ACCENT[accent] || ACCENT.blue} text-white py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl`}
  >
    {loading ? (
      <div className="flex items-center justify-center gap-2">
        <Spinner />{loadingText}
      </div>
    ) : children}
  </button>
);

export default SubmitButton;
