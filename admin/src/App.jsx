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
import { DoctorContext } from './context/DoctorContext.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx'
 
 

const App = () => {
  const {aToken} = useContext(AdminContext);
  const {dToken} = useContext(DoctorContext)

  return aToken || dToken ? (
    <div> 
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <SideBar/>
        <Routes>
          {/* Admin Routes */}
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/doctor-list' element={<DoctorList/>}/>
          <Route path='/all-appointments' element={<AllAppointment/>}/>

          {/* Doctor Routes */}
          <Route path='/doctor-profile' element={<DoctorProfile/>}/>
          <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>

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
