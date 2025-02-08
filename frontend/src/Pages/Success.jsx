import React from "react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for your payment. Your transaction has been completed
          successfully.
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

export default Success;
