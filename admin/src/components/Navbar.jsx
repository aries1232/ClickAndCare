import React, { useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { assets } from '../assets/assets.js'
import { AdminContext } from '../context/AdminContext.jsx';

const Navbar = () => {
  const {aToken,setAToken} = useContext(AdminContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    if(aToken){
      setAToken('');
      localStorage.removeItem('aToken');
    }
  }
  return (
    <div className="flex items-center justify-between px-4 sm:px-10 py-3 border-b border-gray-500">
      <div className="flex items-center gap-3">
        <img className="w-12 sm:w-20 md:w-24 lg:w-28 xl:w-32 max-w-full h-auto cursor-pointer" src={assets.logo} alt="Logo" />
        <div className="border border-gray-500 px-3 py-1 rounded-full text-sm">Admin</div>
      </div>

      <button onClick={logout} className="text-white text-sm px-6 sm:px-10 py-2 rounded-full bg-primary">Logout</button>
    </div>
  )
}

export default Navbar