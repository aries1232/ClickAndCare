import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Appointment from "./Pages/Appointment";
import Doctors from "./Pages/Doctors";
import MyProfile from "./Pages/MyProfile";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Contact from './Pages/Contact'
import MyAppointment from "./Pages/MyAppointment";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
     <Navbar/>
      <Routes>
     
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/my-appointment" element={<MyAppointment />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} /> 

      </Routes>
     
      <Footer/>
      <ToastContainer />
    </div>
  );
};

export default App;
