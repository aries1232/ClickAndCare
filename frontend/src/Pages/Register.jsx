import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import logo from '../assets/logo.png';
import PasswordInput from '../Components/PasswordInput.jsx';
import OtpInput from '../Components/OtpInput.jsx';
import { registerUser, verifyOtp, googleLogin as googleLoginApi } from '../services/authApi';
import { decodeGoogleJwt } from '../utils/googleAuthUtils';
import { isValidPassword, isValidOtp } from '../utils/validators';

const Register = () => {
  const { backendUrl } = useContext(AppContext);
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
      const data = await googleLoginApi(backendUrl, payload);
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
      const data = await registerUser(backendUrl, {
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
      const data = await verifyOtp(backendUrl, { userId: tempUserId, otp });
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="https://clickandcare.netlify.app">
            <img src={logo} alt="Click&Care" className="w-40 h-22 mx-auto mb-4" />
          </a>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-300">Join Click&Care to book appointments with top doctors</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none bg-white dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Email Address
              </label>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={emailVerified}
                  className={`flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none bg-white dark:bg-gray-900 dark:text-white ${
                    emailVerified ? 'bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={sendEmailOTP}
                  disabled={emailVerifying || emailVerified || !formData.email}
                  className="px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {emailVerified ? '✓ Verified' : emailVerifying ? 'Sending...' : 'Verify'}
                </button>
              </div>
            </div>

            {otpSent && !emailVerified && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification OTP
                </label>
                <div className="flex gap-2">
                  <OtpInput value={otp} onChange={setOtp} />
                  <button
                    type="button"
                    onClick={verifyEmailOTP}
                    disabled={emailVerifying || !isValidOtp(otp)}
                    className="px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {emailVerifying ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Check your email for the verification code</p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <PasswordInput
                value={formData.password}
                onChange={handleChange}
                name="password"
                placeholder="Enter password (min 8 characters)"
              />
            </div>

            <button
              type="submit"
              disabled={!emailVerified}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {emailVerified ? 'Account Created Successfully!' : 'Verify Email to Continue'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => toast.error('Google signup failed. Please try again.')}
              useOneTap
              theme="outline"
              shape="pill"
              text="signup_with"
              logo_alignment="center"
            />
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
            >
              Sign in to your account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
