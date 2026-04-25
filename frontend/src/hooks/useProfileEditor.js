import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppContext } from '../context/AppContext';
import { updateUserProfile } from '../services/userApi';

export const useProfileEditor = () => {
  const { userData, setUserData, token, setToken, loadUserProfileData } = useContext(AppContext);
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (token && !userData) {
      loadUserProfileData().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token, userData, loadUserProfileData]);

  const updateUserProfileData = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('userId', userData._id);
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address || { line1: '', line2: '' }));
      formData.append('gender', userData.gender || 'Not Selected');
      formData.append('dob', userData.dob || 'Not Selected');
      if (image) formData.append('image', image);

      const data = await updateUserProfile(token, formData);
      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEdit(false);
    setImage(false);
    loadUserProfileData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const goToLogin = () => navigate('/login');

  const reload = () => window.location.reload();

  return {
    userData, setUserData,
    token,
    isEdit, setIsEdit,
    image, setImage,
    isLoading, isSaving,
    updateUserProfileData,
    cancelEdit,
    handleLogout,
    goToLogin,
    reload,
  };
};
