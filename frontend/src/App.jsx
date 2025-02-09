import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About.jsx";
import Appointment from "./Pages/Appointment.jsx";
import Doctors from "./Pages/Doctors.jsx";
import MyProfile from "./Pages/MyProfile.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Contact from './Pages/Contact.jsx';
import MyAppointment from "./Pages/MyAppointment.jsx";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Success from "./Pages/Success.jsx";
import Cancel from "./Pages/Cancel.jsx";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
     <Navbar/>
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
        <Route path="/contact" element={<Contact />} /> 
        <Route path="/success/:appointmentId" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />

      </Routes>
     
      <Footer/>
      
    </div>
  );
};

export default App;
