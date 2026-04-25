import React from 'react';
import AuthLayout from '../Components/auth/AuthLayout.jsx';
import RegisterForm from '../Components/auth/RegisterForm.jsx';
import GoogleAuthButton from '../Components/auth/GoogleAuthButton.jsx';
import AuthDivider from '../Components/auth/AuthDivider.jsx';
import SecondaryLinkButton from '../Components/auth/SecondaryLinkButton.jsx';
import { useRegisterFlow } from '../hooks/useRegisterFlow';

const Register = () => {
  const flow = useRegisterFlow();
  return (
    <AuthLayout title="Create your account" subtitle="Join Click&Care and start booking with top specialists in seconds.">
      <RegisterForm {...flow} />
      <AuthDivider label="Or sign up with" />
      <GoogleAuthButton onSuccess={flow.handleGoogleSignup} mode="signup" />
      <SecondaryLinkButton to="/login">Sign in to your account</SecondaryLinkButton>
    </AuthLayout>
  );
};

export default Register;
