import React from 'react';

const FIELD = 'appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:z-10 sm:text-sm';

const AdminResetPasswordForm = ({
  otp, setOtp,
  newPassword, setNewPassword,
  confirmPassword, setConfirmPassword,
  isResetting, onSubmit, onBack,
}) => (
  <form className="mt-8 space-y-6" onSubmit={onSubmit}>
    <div className="space-y-4">
      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">OTP Code</label>
        <input
          id="otp"
          type="text"
          required
          maxLength="6"
          className={`${FIELD} text-center text-lg font-mono`}
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
        />
        <p className="mt-1 text-xs text-gray-500">Enter the 6-digit code sent to your recovery emails</p>
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
        <input
          id="newPassword"
          type="password"
          required
          className={FIELD}
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
        <input
          id="confirmPassword"
          type="password"
          required
          className={FIELD}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
    </div>

    <div className="space-y-3">
      <button
        type="submit"
        disabled={isResetting}
        className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isResetting ? 'Resetting Password...' : 'Reset Password'}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full flex justify-center py-2 px-4 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
      >
        Back to Email Input
      </button>
    </div>
  </form>
);

export default AdminResetPasswordForm;
