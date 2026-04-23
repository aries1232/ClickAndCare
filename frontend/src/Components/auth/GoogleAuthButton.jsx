import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

const GoogleAuthButton = ({ onSuccess, mode = 'signin' }) => (
  <div className="mt-6 flex justify-center">
    <GoogleLogin
      onSuccess={onSuccess}
      onError={() => toast.error(mode === 'signup' ? 'Google signup failed. Please try again.' : 'Google login failed. Please try again.')}
      useOneTap
      theme="outline"
      shape="pill"
      text={mode === 'signup' ? 'signup_with' : 'signin_with'}
      logo_alignment="center"
    />
  </div>
);

export default GoogleAuthButton;
