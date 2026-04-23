import React from 'react';
import logo from '../../assets/logo.png';

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <a href="https://clickandcare.netlify.app">
          <img src={logo} alt="Click&Care" className="w-40 h-22 mx-auto mb-4" />
        </a>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{title}</h1>
        {subtitle && <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
