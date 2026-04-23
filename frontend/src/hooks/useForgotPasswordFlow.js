import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword, resetPassword } from '../services/authApi';
import { isValidPassword, passwordsMatch } from '../utils/validators';

export const useForgotPasswordFlow = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [userId, setUserId] = useState('');

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');

    setLoading(true);
    try {
      const data = await forgotPassword({ email });
      if (data.success) {
        setUserId(data.userId);
        setOtpSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) return toast.error('Please fill in all fields');
    if (!passwordsMatch(newPassword, confirmPassword)) return toast.error('Passwords do not match');
    if (!isValidPassword(newPassword)) return toast.error('Password must be at least 8 characters long');

    setLoading(true);
    try {
      const data = await resetPassword({ userId, otp, newPassword });
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    email, setEmail,
    otp, setOtp,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    loading, otpSent,
    sendOTP, handleResetPassword,
    goToLogin: () => navigate('/login'),
  };
};
