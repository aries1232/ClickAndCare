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
import ScrollToTop from "./Components/ScrollToTop.jsx";
import { Toaster } from 'sonner';
import Success from "./Pages/Success.jsx";
import Cancel from "./Pages/Cancel.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DarkModeProvider, useDarkMode } from "./context/DarkModeContext";

// Sonner Toaster needs to read dark-mode state, so it lives in a child of
// DarkModeProvider (calling useDarkMode at the App level would fail because
// App *renders* the provider — it isn't a descendant of it).
const AppToaster = () => {
  const { isDarkMode } = useDarkMode();
  return (
    <Toaster
      position="bottom-right"
      closeButton
      duration={3500}
      theme="dark"
      toastOptions={{
        classNames: {
          toast: '!bg-gray-900 !text-white !border !border-gray-700 !shadow-2xl',
          title: '!text-white !font-semibold',
          description: '!text-gray-300',
          actionButton: '!bg-primary !text-white',
          cancelButton: '!bg-gray-700 !text-gray-200',
          closeButton: '!bg-gray-800 !text-gray-300 !border-gray-700',
          success: '![--success-bg:rgb(17,24,39)] ![--success-text:rgb(52,211,153)] ![--success-border:rgb(55,65,81)]',
          error: '![--error-bg:rgb(17,24,39)] ![--error-text:rgb(248,113,113)] ![--error-border:rgb(55,65,81)]',
          warning: '![--warning-bg:rgb(17,24,39)] ![--warning-text:rgb(251,191,36)] ![--warning-border:rgb(55,65,81)]',
          info: '![--info-bg:rgb(17,24,39)] ![--info-text:rgb(96,165,250)] ![--info-border:rgb(55,65,81)]',
        },
      }}
    />
  );
};

const App = () => {
  const location = useLocation();

  // Hide Navbar and Footer on these pages
  const hideNavbarFooter = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password";

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <DarkModeProvider>
        <div className="dark:bg-gray-900 dark:text-white min-h-screen">
          <ScrollToTop />
          <div className="mx-4 sm:mx-[10%]">
          <AppToaster />

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
