import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About.jsx";
import Appointment from "./Pages/Appointment.jsx";
import Doctors from "./Pages/Doctors.jsx";
import MyProfile from "./Pages/MyProfile.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import OTPVerification from "./Pages/OTPVerification.jsx";
import Contact from './Pages/Contact.jsx';
import MyAppointment from "./Pages/MyAppointment.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Success from "./Pages/Success.jsx";
import Cancel from "./Pages/Cancel.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DarkModeProvider } from "./context/DarkModeContext";

const App = () => {
  const location = useLocation();

  // Hide Navbar and Footer on these pages
  const hideNavbarFooter = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password";

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <DarkModeProvider>
        <div className="dark:bg-gray-900 dark:text-white min-h-screen">
          <div className="mx-4 sm:mx-[10%]">
          <ToastContainer />

          {/* Show Navbar only if not on Login/Register pages */}
          {!hideNavbarFooter && <Navbar />}

        <div 
          key={location.pathname}
          className="page-transition"
          style={{ 
            position: 'relative',
            minHeight: '100vh',
            width: '100%'
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/appointment/:docId" element={<Appointment />} />
            <Route path="/my-appointments" element={<MyAppointment />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:speciality" element={<Doctors />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Routes>
        </div>

        {/* Show Footer only if not on Login/Register pages */}
        {!hideNavbarFooter && <Footer />}
          </div>
        </div>
      </DarkModeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
