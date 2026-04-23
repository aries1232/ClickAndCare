import React from 'react';
import EmailInput from './EmailInput.jsx';
import SubmitButton from './SubmitButton.jsx';

const ForgotPasswordEmailForm = ({ email, setEmail, loading, sendOTP }) => (
  <form onSubmit={sendOTP} className="space-y-6">
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
      <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
    <SubmitButton loading={loading} loadingText="Sending OTP...">Send OTP</SubmitButton>
  </form>
);

export default ForgotPasswordEmailForm;
