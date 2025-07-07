import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const MyAppointment = () => {
  const { token, backendUrl, getDoctors } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (dateFormat) => {
    const dateArray = dateFormat.split("_");
    return (
      " " +
      dateArray[0] +
      " " +
      months[parseInt(dateArray[1]) - 1] +
      " " +
      dateArray[2]
    );
  };

  const handlePaynow = async (appointmentId) => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY_ID);

    try {
      const response = await axios.post(
        backendUrl + "/api/user/make-payment",
        { appointmentId },
        { headers: { token } }
      );

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
         console.log(data.data);
        // Sort appointments by date in descending order (most recent first)
        const sortedAppointments = data.data.sort((a, b) => b.date - a.date);
        setAppointments(sortedAppointments);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      // console.log(appointmentId)

      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getMyAppointments();
        getDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getMyAppointments();
    }
  }, [token]);

  const getStatusBadge = (appointment) => {
    if (appointment.cancelled) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    } else if (appointment.isCompleted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completed
        </span>
      );
    } else if (appointment.payment) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Confirmed
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending Payment
        </span>
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Appointments</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage and track your scheduled appointments</p>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Doctor Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img 
                        className="w-full h-full object-cover" 
                        src={item.docData.image} 
                        alt={item.docData.name}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDMwIDEwMEMxMzAgMTE2LjU2OSAxMTYuNTY5IDEzMCAxMDAgMTMwQzgzLjQzMSAxMzAgNzAgMTE2LjU2OSA3MCAxMEM3MCA4My40MzEgODMuNDMxIDcwIDEwMCA3MFoiIGZpbGw9IiNEMzQ1NEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzExNi41NjkgMTMwIDEzMCAxNDMuNDMxIDEzMCAxNjBDMTMwIDE3Ni41NjkgMTE2LjU2OSAxOTAgMTAwIDE5MEM4My40MzEgMTkwIDcwIDE3Ni41NjkgNzAgMTYwQzcwIDE0My40MzEgODMuNDMxIDEzMCAxMDAgMTMwWiIgZmlsbD0iI0QzNDU0RjYiLz4KPC9zdmc+';
                        }}
                      />
                    </div>
              </div>

                  {/* Appointment Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {item.docData.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{item.docData.speciality}</p>
                      </div>
                      {getStatusBadge(item)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>
                </div>

                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Consultation Fee</p>
                        <p className="font-medium text-primary">₹{item.amount}</p>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Address</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.docData.address?.address || 'Address not available'}
                </p>
              </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    {!item.payment && !item.cancelled && !item.isCompleted && (
                  <>
                    <button
                      onClick={() => handlePaynow(item._id)}
                      className="text-sm text-stone-400 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      Pay Now
                    </button>
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm text-stone-400 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}
                    
                    {item.payment && !item.isCompleted && !item.cancelled && (
                    <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                      Payment Done !
                    </button>
                )}
                    
                  {item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-gray-400 rounded text-gray-500">
                    Appointment Completed
                  </button>
                )}
                    
                    {item.cancelled && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment Cancelled
                  </button>
                )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Appointments Found</h3>
            <p className="text-gray-600 dark:text-gray-300">You haven't booked any appointments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointment;
