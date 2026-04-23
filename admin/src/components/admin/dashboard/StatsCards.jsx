import React from 'react';

const StatCard = ({ accent, iconPath, label, value }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
    <div className="flex items-center">
      <div className={`p-2 ${accent} rounded-lg`}>
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <p className="text-2xl font-semibold text-white">{value || 0}</p>
      </div>
    </div>
  </div>
);

const StatsCards = ({ dashData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard
      accent="bg-blue-600"
      iconPath="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
      label="Total Users"
      value={dashData.users}
    />
    <StatCard
      accent="bg-green-600"
      iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      label="Total Doctors"
      value={dashData.doctors}
    />
    <StatCard
      accent="bg-purple-600"
      iconPath="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      label="Total Appointments"
      value={dashData.appointments}
    />
    <StatCard
      accent="bg-yellow-600"
      iconPath="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      label="Pending Doctors"
      value={dashData.pendingDoctors}
    />
  </div>
);

export default StatsCards;
