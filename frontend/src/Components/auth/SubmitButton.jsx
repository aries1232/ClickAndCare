import React from 'react';

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const SubmitButton = ({ loading, disabled, loadingText, children, type = 'submit', onClick }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={loading || disabled}
    className="w-full inline-flex items-center justify-center bg-primary !text-white py-3 px-4 rounded-full font-semibold shadow-md shadow-primary/30 hover:bg-emerald-500 hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
  >
    {loading ? <><Spinner />{loadingText || 'Loading…'}</> : children}
  </button>
);

export default SubmitButton;
