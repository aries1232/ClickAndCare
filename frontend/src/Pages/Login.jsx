import React from 'react';
import AuthLayout from '../Components/auth/AuthLayout.jsx';
import LoginForm from '../Components/auth/LoginForm.jsx';
import GoogleAuthButton from '../Components/auth/GoogleAuthButton.jsx';
import AuthDivider from '../Components/auth/AuthDivider.jsx';
import SecondaryLinkButton from '../Components/auth/SecondaryLinkButton.jsx';
import { useLoginForm } from '../hooks/useLoginForm';

const Login = () => {
  const form = useLoginForm();
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your appointments and chat with your doctor.">
      <LoginForm {...form} />
      <AuthDivider label="Or continue with" />
      <GoogleAuthButton onSuccess={form.handleGoogleLogin} mode="signin" />
      <AuthDivider label="New to Click&Care?" />
      <SecondaryLinkButton to="/register">Create an account</SecondaryLinkButton>
    </AuthLayout>
  );
};

export default Login;
