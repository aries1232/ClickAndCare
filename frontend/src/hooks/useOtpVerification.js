import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppContext } from '../context/AppContext';
import { verifyOtp, resendOtp } from '../services/authApi';
import { useOtpCountdown } from './useOtpCountdown';
import { isValidOtp } from '../utils/validators';

export const useOtpVerification = () => {
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { seconds, start } = useOtpCountdown();

  useEffect(() => {
    const tempUserId = localStorage.getItem('tempUserId');
    if (!tempUserId) {
      toast.error('Please register first');
      navigate('/register');
      return;
    }
    start();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidOtp(otp)) return toast.error('Please enter a 6-digit OTP');

    const tempUserId = localStorage.getItem('tempUserId');
    if (!tempUserId) {
      toast.error('Session expired. Please register again.');
      navigate('/register');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp({ userId: tempUserId, otp });
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem('token', data.token);
        localStorage.removeItem('tempUserId');
        setToken(data.token);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const tempUserId = localStorage.getItem('tempUserId');
    if (!tempUserId) {
      toast.error('Session expired. Please register again.');
      navigate('/register');
      return;
    }

    setResendLoading(true);
    try {
      const data = await resendOtp({ userId: tempUserId });
      if (data.success) {
        toast.success(data.message);
        start();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const goBackToRegister = () => {
    localStorage.removeItem('tempUserId');
    navigate('/register');
  };

  return { otp, setOtp, loading, resendLoading, seconds, handleSubmit, handleResendOTP, goBackToRegister };
};
