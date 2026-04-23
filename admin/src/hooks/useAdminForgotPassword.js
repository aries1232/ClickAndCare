import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminForgotPassword, adminResetPassword } from '../services/adminApi';
import { passwordsMatch } from '../utils/validators';

export const useAdminForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Please enter your admin email or recovery email');

    setIsLoading(true);
    try {
      const data = await adminForgotPassword({ email: email.trim() });
      if (data.success) {
        toast.success(data.message);
        setOtpSent(true);
        if (data.adminEmail) setAdminEmail(data.adminEmail);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error('Please enter the OTP');
    if (!newPassword.trim()) return toast.error('Please enter a new password');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters long');
    if (!passwordsMatch(newPassword, confirmPassword)) return toast.error('Passwords do not match');

    setIsResetting(true);
    try {
      const data = await adminResetPassword({ email: adminEmail || email, otp, newPassword });
      if (data.success) {
        toast.success('Password reset successfully! Please login with your new password.');
        navigate('/admin/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  const resetStage = () => {
    setOtpSent(false);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return {
    email, setEmail,
    otp, setOtp,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    otpSent, isLoading, isResetting,
    handleSendOTP, handleResetPassword, resetStage,
    goToLogin: () => navigate('/admin/login'),
  };
};
