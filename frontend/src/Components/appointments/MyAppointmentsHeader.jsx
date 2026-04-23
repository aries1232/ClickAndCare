import React from 'react';

const MyAppointmentsHeader = () => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Appointments</h1>
    <div className="mb-6 flex items-center justify-between">
      <p className="text-gray-600 dark:text-gray-300">Manage and track your scheduled appointments</p>
      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg shadow-sm">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <span className="text-sm">Chat with doctor will be available only after payment is completed for the appointment.</span>
      </div>
    </div>
  </div>
);

export default MyAppointmentsHeader;
