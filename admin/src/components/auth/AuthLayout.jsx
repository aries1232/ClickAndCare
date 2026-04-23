import React from 'react';

const AuthLayout = ({ icon, title, subtitle, children }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        {icon}
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        {subtitle && <p className="text-gray-300">{subtitle}</p>}
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
