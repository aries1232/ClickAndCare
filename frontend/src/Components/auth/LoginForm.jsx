import React from 'react';
import EmailInput from './EmailInput.jsx';
import PasswordInput from '../PasswordInput.jsx';
import SubmitButton from './SubmitButton.jsx';

const LoginForm = ({ email, setEmail, password, setPassword, loading, handleSubmit, goToForgotPassword }) => (
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email Address</label>
      <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>

    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Password</label>
      <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>

    <div className="flex items-center justify-end">
      <button type="button" onClick={goToForgotPassword} className="text-sm font-medium text-primary hover:text-green-600 transition-colors">
        Forgot password?
      </button>
    </div>

    <SubmitButton loading={loading} loadingText="Signing in...">Sign In</SubmitButton>
  </form>
);

export default LoginForm;
