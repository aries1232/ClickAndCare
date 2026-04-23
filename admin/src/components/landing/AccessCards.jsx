import React from 'react';
import { useNavigate } from 'react-router-dom';

const ACCENT_BTN = {
  blue: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/25',
  green: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-green-500/25',
  purple: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-purple-500/25',
};

const ACCENT_ICON = {
  blue: 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/25',
  green: 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/25',
};

const ACCENT_BORDER = {
  blue: 'hover:border-blue-500/50',
  green: 'hover:border-green-500/50',
};

const Card = ({ accent, iconPath, title, subtitle, actions }) => (
  <div className={`bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50 transition-all duration-300 transform hover:scale-105 ${ACCENT_BORDER[accent]}`}>
    <div className="text-center space-y-6">
      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center shadow-xl ${ACCENT_ICON[accent]}`}>
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-300 mb-6">{subtitle}</p>
      </div>
      <div className="space-y-3">
        {actions.map((a, i) => (
          <ActionButton key={i} {...a} />
        ))}
      </div>
    </div>
  </div>
);

const ActionButton = ({ label, to, accent }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${ACCENT_BTN[accent]}`}
    >
      {label}
    </button>
  );
};

const AccessCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    <Card
      accent="blue"
      iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      title="Admin Access"
      subtitle="Manage doctors, appointments, and system settings"
      actions={[{ label: 'Login as Admin', to: '/admin-login', accent: 'blue' }]}
    />
    <Card
      accent="green"
      iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      title="Doctor Access"
      subtitle="Manage your appointments and patient care"
      actions={[
        { label: 'Login as Doctor', to: '/doctor-login', accent: 'green' },
        { label: 'Register as Doctor', to: '/doctor-signup', accent: 'purple' },
      ]}
    />
  </div>
);

export default AccessCards;
