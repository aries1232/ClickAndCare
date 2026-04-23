import React from 'react';
import OtpInput from '../Components/OtpInput.jsx';
import { useOtpVerification } from '../hooks/useOtpVerification';
import { isValidOtp } from '../utils/validators';
import './login.css';

const OTPVerification = () => {
  const { otp, setOtp, loading, resendLoading, seconds, handleSubmit, handleResendOTP, goBackToRegister } = useOtpVerification();

  return (
    <div className="container">
      <div className="header">
        <div className="text">Verify Email</div>
        <div className="underline"></div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>We've sent a 6-digit verification code to your email address.</p>
        <p style={{ color: '#666', fontSize: '14px' }}>Please enter the code below to verify your account.</p>
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
            style={{ width: '100%', cursor: loading || !isValidOtp(otp) ? 'not-allowed' : 'pointer', opacity: loading || !isValidOtp(otp) ? 0.7 : 1 }}
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
          style={{ background: 'none', border: 'none', color: seconds > 0 ? '#999' : '#4F46E5', cursor: resendLoading || seconds > 0 ? 'not-allowed' : 'pointer', textDecoration: 'underline', fontSize: '14px' }}
        >
          {resendLoading ? 'Sending...' : seconds > 0 ? `Resend in ${seconds}s` : 'Resend OTP'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span onClick={goBackToRegister} style={{ color: '#4F46E5', cursor: 'pointer', textDecoration: 'underline' }}>
          Back to Registration
        </span>
      </div>
    </div>
  );
};

export default OTPVerification;
