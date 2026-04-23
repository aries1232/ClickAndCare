import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { loginUser, googleLogin as googleLoginApi } from '../services/authApi';
import { decodeGoogleJwt } from '../utils/googleAuthUtils';

export const useLoginForm = () => {
  const { token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');

    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success('Login Success');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const payload = decodeGoogleJwt(credentialResponse.credential);
      const data = await googleLoginApi(payload);
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        toast.success('Google login successful');
      } else {
        toast.error(data.message || 'Failed to login with Google');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Google login failed. Please try again.');
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    loading,
    handleSubmit,
    handleGoogleLogin,
    goToForgotPassword: () => navigate('/forgot-password'),
  };
};
