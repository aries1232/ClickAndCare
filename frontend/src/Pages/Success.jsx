import React, { useContext, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';
import { updatePaymentStatus } from '../services/appointmentApi';

const Success = () => {
  const { token } = useContext(AppContext);
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!appointmentId) {
      toast.warn('Appointment ID is missing.');
      navigate('/');
      return;
    }

    (async () => {
      try {
        const data = await updatePaymentStatus(token, { appointmentId });
        if (data.success) toast.success('Payment status updated successfully');
        else toast.error(data.message || 'Payment update failed.');
      } catch {
        toast.error('Error updating payment status.');
      }
    })();
  }, [appointmentId, token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">Payment Successful!</h1>
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
