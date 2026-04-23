import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser, verifyOtp, googleLogin as googleLoginApi } from '../services/authApi';
import { decodeGoogleJwt } from '../utils/googleAuthUtils';
import { isValidPassword, isValidOtp } from '../utils/validators';

export const useRegisterFlow = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [tempUserId, setTempUserId] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const payload = decodeGoogleJwt(credentialResponse.credential);
      const data = await googleLoginApi(payload);
      if (data.success) {
        localStorage.setItem('token', data.token);
        toast.success('Account created with Google!');
        navigate('/');
      } else {
        toast.error(data.message || 'Failed to create account with Google');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google signup failed. Please try again.');
    }
  };

  const sendEmailOTP = async () => {
    if (!formData.email) return toast.error('Please enter your email address first');
    if (!formData.name) return toast.error('Please enter your name first');
    if (!formData.password) return toast.error('Please enter your password first');
    if (!isValidPassword(formData.password)) return toast.error('Password must be at least 8 characters long');

    setEmailVerifying(true);
    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (data.success) {
        setTempUserId(data.userId);
        setOtpSent(true);
        toast.success('OTP sent to your email. Please verify your email.');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setEmailVerifying(false);
    }
  };

  const verifyEmailOTP = async () => {
    if (!isValidOtp(otp)) return toast.error('Please enter a valid 6-digit OTP');

    setEmailVerifying(true);
    try {
      const data = await verifyOtp({ userId: tempUserId, otp });
      if (data.success) {
        setEmailVerified(true);
        toast.success('Email verified successfully!');
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setEmailVerifying(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return toast.error('Please fill in all fields');
    if (!isValidPassword(formData.password)) return toast.error('Password must be at least 8 characters long');
    if (!emailVerified) toast.error('Please verify your email first');
  };

  return {
    formData, handleChange,
    emailVerifying, emailVerified,
    otp, setOtp, otpSent,
    sendEmailOTP, verifyEmailOTP,
    handleSubmit,
    handleGoogleSignup,
  };
};
