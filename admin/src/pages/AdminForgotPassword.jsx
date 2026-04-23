import React from 'react';
import ForgotEmailForm from '../components/auth/ForgotEmailForm.jsx';
import AdminResetPasswordForm from '../components/auth/AdminResetPasswordForm.jsx';
import { useAdminForgotPassword } from '../hooks/useAdminForgotPassword';

const InfoBox = () => (
  <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
    <h3 className="text-sm font-medium text-gray-300 mb-2">How it works:</h3>
    <ul className="text-xs text-gray-400 space-y-1">
      <li>• Enter your admin email address</li>
      <li>• OTP will be sent to all configured recovery emails</li>
      <li>• Check all recovery email inboxes for the OTP</li>
      <li>• Enter the OTP and set your new password</li>
    </ul>
  </div>
);

const AdminForgotPassword = () => {
  const flow = useAdminForgotPassword();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Admin Password Recovery</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {!flow.otpSent
              ? 'Enter your admin email or any recovery email to receive OTP'
              : 'Enter the OTP sent to your recovery emails'}
          </p>
        </div>

        {!flow.otpSent
          ? <ForgotEmailForm {...flow} onSubmit={flow.handleSendOTP} onBack={flow.goToLogin} />
          : <AdminResetPasswordForm {...flow} onSubmit={flow.handleResetPassword} onBack={flow.resetStage} />}

        <InfoBox />
      </div>
    </div>
  );
};

export default AdminForgotPassword;
