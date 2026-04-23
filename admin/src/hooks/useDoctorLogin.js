import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';
import { doctorLogin } from '../services/doctorApi';

export const useDoctorLogin = () => {
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dToken) navigate('/doctor/dashboard');
  }, [dToken, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await doctorLogin({ email, password });
      if (data.success) {
        localStorage.setItem('dToken', data.token);
        setDToken(data.token);
        toast.success('Doctor login successful!');
        navigate('/doctor/dashboard');
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
