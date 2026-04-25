import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AppContext } from '../context/AppContext';
import { useUnreadCounts } from './useUnreadCounts';

export const useNavbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);
  const { totalUnreadCount } = useUnreadCounts();

  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem('token');
    toast.success('Logged Out');
    setShowUserMenu(false);
    navigate('/');
  };

  const handleUserMenuClick = (action) => {
    setShowUserMenu(false);
    if (action === 'profile') navigate('/my-profile');
    else if (action === 'appointments') navigate('/my-appointments');
  };

  const goToLogin = () => navigate('/login');
  const goHome = () => navigate('/');

  return {
    token, userData, totalUnreadCount,
    showMenu, setShowMenu,
    showUserMenu, setShowUserMenu,
    logout, handleUserMenuClick,
    goToLogin, goHome,
  };
};
