import React from 'react';
import AuthLayout from '../Components/auth/AuthLayout.jsx';
import ForgotPasswordEmailForm from '../Components/auth/ForgotPasswordEmailForm.jsx';
import ResetPasswordForm from '../Components/auth/ResetPasswordForm.jsx';
import { useForgotPasswordFlow } from '../hooks/useForgotPasswordFlow';

const ForgotPassword = () => {
  const flow = useForgotPasswordFlow();
  const title = flow.otpSent ? 'Reset Password' : 'Forgot Password';
  const subtitle = flow.otpSent
    ? 'Enter the OTP sent to your email and create a new password'
    : 'Enter your email address to receive a password reset OTP';

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {flow.otpSent ? <ResetPasswordForm {...flow} /> : <ForgotPasswordEmailForm {...flow} />}
      <div className="mt-6 text-center">
        <button onClick={flow.goToLogin} className="text-primary hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 transition-colors font-medium">
          ← Back to Login
        </button>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
