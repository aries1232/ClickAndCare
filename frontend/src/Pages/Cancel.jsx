import React from "react";

const Cancel = () => {
  console.log("Cancel component rendered");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-700 mb-6">
          Your payment has been cancelled. If you have any questions, please
          contact support.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Cancel;
