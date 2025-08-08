import React, { useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext.jsx";

const Success = () => {
  const { backendUrl } = useContext(AppContext);
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/user/update-payment-status`, {
          appointmentId,
        });

        if (response.data.success) {
          toast.success("Payment status updated successfully");
          

        } else {
          
          console.error("Payment update failed on server:", response.data.message || "Unknown error");
          toast.error(response.data.message || "Payment update failed.");
        }
      } catch (error) {
        console.error("Error updating payment status:", error);
        toast.error("Error updating payment status.");
      }
    };

    if (appointmentId) {
      updatePaymentStatus();
    } else {
       
      console.warn("Appointment ID is missing.");
      toast.warn("Appointment ID is missing.");
      navigate("/");  
    }
  }, [appointmentId, backendUrl, navigate]);  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>
        <Link
          to="/my-appointments"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Go to My Appointments
        </Link>
      </div>
    </div>
  );
};

export default Success;