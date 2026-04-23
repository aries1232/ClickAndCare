import React from 'react';

const ForgotEmailForm = ({ email, setEmail, isLoading, onSubmit, onBack }) => (
  <form className="mt-8 space-y-6" onSubmit={onSubmit}>
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
        Admin Email or Recovery Email
      </label>
      <input
        id="email"
        type="email"
        required
        className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:z-10 sm:text-sm"
        placeholder="Enter admin email or any recovery email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {isLoading ? 'Sending OTP...' : 'Send OTP to Recovery Emails'}
    </button>

    <div className="text-center">
      <button type="button" onClick={onBack} className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors duration-200">
        Back to Login
      </button>
    </div>
  </form>
);

export default ForgotEmailForm;
