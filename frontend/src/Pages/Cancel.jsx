import React, { useContext, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { releaseLock } from "../services/appointmentApi";

const Cancel = () => {
  const [params] = useSearchParams();
  const { token } = useContext(AppContext);
  const appointmentId = params.get("appointment_id");

  useEffect(() => {
    if (!appointmentId || !token) return;
    // Best-effort: drop the soft lock immediately so the slot reopens
    // without waiting for Stripe's `checkout.session.expired` webhook.
    releaseLock(token, { appointmentId }).catch(() => {});
  }, [appointmentId, token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-700 mb-6">
          Your payment has been cancelled and the slot has been released. You can book again any time.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Cancel;
