import React from 'react';
import EmailInput from './EmailInput.jsx';
import PasswordInput from '../PasswordInput.jsx';
import OtpInput from '../OtpInput.jsx';
import SubmitButton from './SubmitButton.jsx';
import { isValidOtp } from '../../utils/validators';

const NameInput = ({ value, onChange }) => (
  <div>
    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Full Name</label>
    <input
      id="name"
      type="text"
      name="name"
      placeholder="Enter your full name"
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none bg-white dark:bg-gray-900 dark:text-white"
    />
  </div>
);

const EmailVerifyRow = ({ email, onChange, verified, verifying, onVerify }) => (
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email Address</label>
    <div className="flex gap-2">
      <EmailInput
        value={email}
        onChange={onChange}
        disabled={verified}
        className={`flex-1 ${verified ? 'bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700' : ''}`}
      />
      <button
        type="button"
        onClick={onVerify}
        disabled={verifying || verified || !email}
        className="px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {verified ? '✓ Verified' : verifying ? 'Sending...' : 'Verify'}
      </button>
    </div>
  </div>
);

const OtpRow = ({ otp, setOtp, verifying, onVerifyOtp }) => (
  <div>
    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">Verification OTP</label>
    <div className="flex gap-2">
      <OtpInput value={otp} onChange={setOtp} />
      <button
        type="button"
        onClick={onVerifyOtp}
        disabled={verifying || !isValidOtp(otp)}
        className="px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {verifying ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
    <p className="text-sm text-gray-500 mt-2">Check your email for the verification code</p>
  </div>
);

const RegisterForm = ({ formData, handleChange, emailVerifying, emailVerified, otp, setOtp, otpSent, sendEmailOTP, verifyEmailOTP, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="space-y-6">
    <NameInput value={formData.name} onChange={handleChange} />

    <EmailVerifyRow
      email={formData.email}
      onChange={handleChange}
      verified={emailVerified}
      verifying={emailVerifying}
      onVerify={sendEmailOTP}
    />

    {otpSent && !emailVerified && (
      <OtpRow otp={otp} setOtp={setOtp} verifying={emailVerifying} onVerifyOtp={verifyEmailOTP} />
    )}

    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
      <PasswordInput
        value={formData.password}
        onChange={handleChange}
        name="password"
        placeholder="Enter password (min 8 characters)"
      />
    </div>

    <SubmitButton disabled={!emailVerified} loading={false}>
      {emailVerified ? 'Account Created Successfully!' : 'Verify Email to Continue'}
    </SubmitButton>
  </form>
);

export default RegisterForm;
