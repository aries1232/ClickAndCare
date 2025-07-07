import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';

// Pages
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminForgotPassword from './pages/AdminForgotPassword';
import DoctorLogin from './pages/DoctorLogin';
import DoctorSignup from './pages/Doctor/DoctorSignup';
import AdminDashboard from './pages/Admin/Dashboard';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/DoctorList';
import AllAppointment from './pages/Admin/AllAppointment';
import PendingDoctors from './pages/Admin/PendingDoctors';
import AdminLogs from './pages/Admin/AdminLogs';
import AdminSettings from './pages/Admin/AdminSettings';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import PatientManagement from './pages/Doctor/PatientManagement';
import ScheduleManagement from './pages/Doctor/ScheduleManagement';
import AdminLayout from './components/AdminLayout';
import DoctorLayout from './components/DoctorLayout';

function App() {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  useEffect(() => {
    // Update tokens when localStorage changes
    const handleStorageChange = () => {
      setAToken(localStorage.getItem('aToken'));
      setDToken(localStorage.getItem('dToken'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setAToken, setDToken]);

  return (
    <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
              <Route path="/doctor-login" element={<DoctorLogin />} />
              <Route path="/doctor-signup" element={<DoctorSignup />} />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin/*" 
                element={aToken ? (
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="add-doctor" element={<AddDoctor />} />
                      <Route path="doctor-list" element={<DoctorList />} />
                      <Route path="all-appointments" element={<AllAppointment />} />
                      <Route path="pending-doctors" element={<PendingDoctors />} />
                      <Route path="logs" element={<AdminLogs />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </AdminLayout>
                ) : (
                  <Navigate to="/admin-login" replace />
                )} 
              />

              {/* Protected Doctor Routes */}
              <Route 
                path="/doctor/*" 
                element={dToken ? (
                  <DoctorLayout>
                    <Routes>
                      <Route path="dashboard" element={<DoctorDashboard />} />
                      <Route path="appointments" element={<DoctorAppointments />} />
                      <Route path="patients" element={<PatientManagement />} />
                      <Route path="schedule" element={<ScheduleManagement />} />
                      <Route path="profile" element={<DoctorProfile />} />
                      <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
                    </Routes>
                  </DoctorLayout>
                ) : (
                  <Navigate to="/doctor-login" replace />
                )} 
              />

              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <ToastContainer 
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
  );
}

export default App;
