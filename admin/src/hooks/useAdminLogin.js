import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';
import { adminLogin } from '../services/adminApi';

export const useAdminLogin = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (aToken) navigate('/admin/dashboard');
  }, [aToken, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminLogin({ email, password });
      if (data.success) {
        localStorage.setItem('aToken', data.token);
        setAToken(data.token);
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, loading, onSubmit };
};
