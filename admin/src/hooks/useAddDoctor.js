import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';
import { addDoctor } from '../services/adminApi';

const INITIAL = {
  name: '', email: '', password: '', address: '',
  experience: 'No Experience', fees: '', about: '',
  speciality: 'General Physician', degree: '',
};

export const useAddDoctor = () => {
  const { aToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL);
  const [docImg, setDocImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const resetForm = () => { setForm(INITIAL); setDocImg(false); };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      if (docImg) formData.append('image', docImg);
      formData.append('email', form.email);
      formData.append('speciality', form.speciality);
      formData.append('experience', form.experience);
      formData.append('about', form.about);
      formData.append('fees', Number(form.fees));
      formData.append('degree', form.degree);
      formData.append('address', JSON.stringify({ address: form.address }));
      formData.append('password', form.password);

      const data = await addDoctor(aToken, formData);
      if (data.success) {
        toast.success(data.message);
        resetForm();
        navigate('/admin/doctor-list');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  return {
    form, setField,
    docImg, setDocImg,
    loading,
    onSubmit,
    resetForm,
    goToList: () => navigate('/admin/doctor-list'),
  };
};
