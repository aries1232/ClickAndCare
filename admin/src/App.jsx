import React from 'react'
import Login from './pages/Login.jsx'
import { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext.jsx';
import Navbar from './components/Navbar.jsx';
import SideBar from './components/Sidebar.jsx';
import { Route,Routes } from 'react-router-dom';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import DoctorList from './pages/Admin/DoctorList.jsx';
import AllAppointment from './pages/Admin/AllAppointment.jsx';
 
 

const App = () => {
  const {aToken} = useContext(AdminContext);

  return aToken ? (
    <div> 
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <SideBar/>
        <Routes>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/doctor-list' element={<DoctorList/>}/>
          <Route path='/all-appointments' element={<AllAppointment/>}/>
        </Routes>
      </div>
    </div>
  ) : (
    <div>
      <Login/>
      <ToastContainer/>
    </div>
  )
}

export default App
