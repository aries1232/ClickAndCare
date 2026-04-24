import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';
import { verifyPayment } from '../services/appointmentApi';

const Success = () => {
  const { token } = useContext(AppContext);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  const sessionId = params.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      toast.warn('Missing payment session.');
      navigate('/');
      return;
    }
    (async () => {
      try {
        const data = await verifyPayment(token, sessionId);
        if (data.success) {
          setStatus('confirmed');
        } else {
          setStatus('failed');
          toast.error(data.message || 'Payment verification failed.');
        }
      } catch {
        setStatus('failed');
        toast.error('Error verifying payment.');
      }
    })();
  }, [sessionId, token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        {status === 'verifying' && (
          <>
            <h1 className="text-2xl font-semibold text-gray-700 mb-4">Verifying Payment...</h1>
            <p className="text-gray-600">Please wait while we confirm your transaction.</p>
          </>
        )}
        {status === 'confirmed' && (
          <>
            <h1 className="text-2xl font-semibold text-green-600 mb-4">Payment Successful!</h1>
            <p className="text-gray-700 mb-6">
              Your appointment is confirmed. The doctor will see you at the booked time.
            </p>
            <Link
              to="/my-appointments"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Go to My Appointments
            </Link>
          </>
        )}
        {status === 'failed' && (
          <>
            <h1 className="text-2xl font-semibold text-red-600 mb-4">Verification Failed</h1>
            <p className="text-gray-700 mb-6">
              We couldn't verify your payment. If your card was charged, it'll be reflected on the appointments page within a minute.
            </p>
            <Link
              to="/my-appointments"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            >
              Go to My Appointments
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Success;
