import React from 'react';
import OtpInput from '../OtpInput.jsx';
import PasswordInput from '../PasswordInput.jsx';
import SubmitButton from './SubmitButton.jsx';

const ResetPasswordForm = ({ otp, setOtp, newPassword, setNewPassword, confirmPassword, setConfirmPassword, loading, handleResetPassword }) => (
  <form onSubmit={handleResetPassword} className="space-y-6">
    <div>
      <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">OTP Code</label>
      <OtpInput value={otp} onChange={setOtp} />
    </div>

    <div>
      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
      <PasswordInput id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
    </div>

    <div>
      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
      <PasswordInput id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
    </div>

    <SubmitButton loading={loading} loadingText="Resetting Password...">Reset Password</SubmitButton>
  </form>
);

export default ResetPasswordForm;
