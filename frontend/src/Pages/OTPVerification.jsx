import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import OtpInput from '../Components/OtpInput.jsx';
import { verifyOtp, resendOtp } from '../services/authApi';
import { useOtpCountdown } from '../hooks/useOtpCountdown';
import { isValidOtp } from '../utils/validators';
import './login.css';

const OTPVerification = () => {
  const { backendUrl, setToken } = useContext(AppContext);
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
      const data = await verifyOtp(backendUrl, { userId: tempUserId, otp });
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
      const data = await resendOtp(backendUrl, { userId: tempUserId });
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

  return (
    <div className="container">
      <div className="header">
        <div className="text">Verify Email</div>
        <div className="underline"></div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>
          We've sent a 6-digit verification code to your email address.
        </p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Please enter the code below to verify your account.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <div className="input" style={{ textAlign: 'center' }}>
            <OtpInput value={otp} onChange={setOtp} />
          </div>
        </div>

        <div className="submit-container">
          <button
            type="submit"
            className="submit"
            disabled={loading || !isValidOtp(otp)}
            style={{
              width: '100%',
              cursor: loading || !isValidOtp(otp) ? 'not-allowed' : 'pointer',
              opacity: loading || !isValidOtp(otp) ? 0.7 : 1,
            }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#666', fontSize: '12px', marginBottom: '10px' }}>Didn't receive the code?</p>
        <button
          onClick={handleResendOTP}
          disabled={resendLoading || seconds > 0}
          style={{
            background: 'none',
            border: 'none',
            color: seconds > 0 ? '#999' : '#4F46E5',
            cursor: resendLoading || seconds > 0 ? 'not-allowed' : 'pointer',
            textDecoration: 'underline',
            fontSize: '14px',
          }}
        >
          {resendLoading ? 'Sending...' : seconds > 0 ? `Resend in ${seconds}s` : 'Resend OTP'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span
          style={{ color: '#4F46E5', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => {
            localStorage.removeItem('tempUserId');
            navigate('/register');
          }}
        >
          Back to Registration
        </span>
      </div>
    </div>
  );
};

export default OTPVerification;
