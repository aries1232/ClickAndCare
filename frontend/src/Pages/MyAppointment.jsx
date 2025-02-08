import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import {loadStripe} from '@stripe/stripe-js';

const MyAppointment = () => {
  const { token, backendUrl, getDoctors } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const slotDateFormat = (dateFormat) => {
    const dateArray = dateFormat.split('_');
    return ' ' + dateArray[0] + ' ' + months[parseInt(dateArray[1])-1] + ' ' + dateArray[2];
  }

  const handlePaynow = async (appointmentId) => {

    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY_ID);
  
    try {
      const response = await axios.post(backendUrl + "/api/user/make-payment", { appointmentId }, { headers: { token } });
  
      if (response.data.success) {
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Payment initiation failed.");
    }
  };
  
  

  const getMyAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
       // console.log(data.data);  
        setAppointments(data.data);  
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async(appointmentId) =>{
    try {

      // console.log(appointmentId)

      const { data } = await axios.post(backendUrl + "/api/user/cancel-appointment", {appointmentId}, {headers: { token }});

      if(data.success){
        toast.success(data.message);
        getMyAppointments();
        getDoctors();
        
      }
      else{
        toast.error(data.message);
      }

  


      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (token) {
      getMyAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={index}
            >
              <div className="">
                <img className="w-32 bg-blue-50" src={item.docData.image} alt="" />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
                <p className="text-gray-400">{item.docData.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{JSON.stringify(item.docData.address
                )}</p>
                <p className="text-sm mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time: 
                  </span>
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div className="flex flex-col gap-2 justify-end">
                {!item.cancelled && <button onClick={()=>handlePaynow(item._id)} className="text-sm text-stone-400 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">
                  Pay Now
                </button>}
                {!item.cancelled && <button onClick={()=>cancelAppointment(item._id)} className="text-sm text-stone-400 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">
                  Cancel Appointment
                </button>}
                {item.cancelled && <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 ">Appointment Cancelled</button>}
              </div>
            </div>
          ))
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default MyAppointment;
