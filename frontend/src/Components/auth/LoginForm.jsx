import React from 'react';
import EmailInput from './EmailInput.jsx';
import PasswordInput from '../PasswordInput.jsx';
import SubmitButton from './SubmitButton.jsx';

const Field = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 sm:mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const LoginForm = ({ email, setEmail, password, setPassword, loading, handleSubmit, goToForgotPassword }) => (
  <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5">
    <Field id="email" label="Email Address">
      <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
    </Field>

    <Field id="password" label="Password">
      <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
    </Field>

    <div className="flex items-center justify-end -mt-1">
      <button
        type="button"
        onClick={goToForgotPassword}
        className="text-sm font-medium text-primary hover:text-emerald-600 transition-colors"
      >
        Forgot password?
      </button>
    </div>

    <SubmitButton loading={loading} loadingText="Signing in…">Sign In</SubmitButton>
  </form>
);

export default LoginForm;
