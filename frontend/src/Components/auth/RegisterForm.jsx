import React from 'react';
import { HiOutlineUser, HiOutlineCheck, HiOutlineMailOpen } from 'react-icons/hi';
import EmailInput from './EmailInput.jsx';
import PasswordInput from '../PasswordInput.jsx';
import OtpInput from '../OtpInput.jsx';
import SubmitButton from './SubmitButton.jsx';
import { isValidOtp } from '../../utils/validators';

const Field = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const NameInput = ({ value, onChange }) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
      <HiOutlineUser className="w-5 h-5" />
    </span>
    <input
      id="name"
      type="text"
      name="name"
      placeholder="Jane Doe"
      value={value}
      onChange={onChange}
      required
      className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 outline-none bg-white dark:bg-gray-900 dark:text-white"
    />
  </div>
);

const VerifyButton = ({ verified, verifying, disabled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`whitespace-nowrap inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
      verified
        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-500/30 cursor-default'
        : 'bg-primary !text-white shadow-md shadow-primary/30 hover:bg-emerald-500 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
    }`}
  >
    {verified ? <><HiOutlineCheck className="w-4 h-4" /> Verified</> : verifying ? 'Sending…' : 'Verify'}
  </button>
);

const EmailVerifyRow = ({ email, onChange, verified, verifying, onVerify }) => (
  <Field id="email" label="Email Address">
    <div className="flex gap-2">
      <EmailInput value={email} onChange={onChange} disabled={verified} className="flex-1" />
      <VerifyButton
        verified={verified}
        verifying={verifying}
        disabled={verifying || verified || !email}
        onClick={onVerify}
      />
    </div>
  </Field>
);

const OtpRow = ({ otp, setOtp, verifying, onVerifyOtp }) => (
  <div className="rounded-xl bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/20 p-4">
    <div className="flex items-center gap-2 mb-3 text-primary">
      <HiOutlineMailOpen className="w-5 h-5" />
      <p className="text-sm font-semibold">Check your email for the OTP</p>
    </div>
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex-1">
        <OtpInput value={otp} onChange={setOtp} />
      </div>
      <button
        type="button"
        onClick={onVerifyOtp}
        disabled={verifying || !isValidOtp(otp)}
        className="whitespace-nowrap inline-flex items-center justify-center px-5 py-3 bg-primary !text-white rounded-lg font-semibold text-sm shadow-md shadow-primary/30 hover:bg-emerald-500 hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {verifying ? 'Verifying…' : 'Verify OTP'}
      </button>
    </div>
  </div>
);

const RegisterForm = ({
  formData,
  handleChange,
  emailVerifying,
  emailVerified,
  otp,
  setOtp,
  otpSent,
  sendEmailOTP,
  verifyEmailOTP,
  handleSubmit,
}) => (
  <form onSubmit={handleSubmit} className="space-y-5">
    <Field id="name" label="Full Name">
      <NameInput value={formData.name} onChange={handleChange} />
    </Field>

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

    <Field id="password" label="Password">
      <PasswordInput
        value={formData.password}
        onChange={handleChange}
        name="password"
        placeholder="At least 8 characters"
      />
    </Field>

    <SubmitButton disabled={!emailVerified} loading={false}>
      {emailVerified ? 'Create Account' : 'Verify Email to Continue'}
    </SubmitButton>
  </form>
);

export default RegisterForm;
