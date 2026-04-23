import React from 'react';

const FEATURES = [
  {
    accent: 'blue',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Easy Scheduling',
    text: 'Book appointments with qualified doctors quickly and easily',
  },
  {
    accent: 'green',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Secure Platform',
    text: 'Your health information is protected with industry-standard security',
  },
  {
    accent: 'purple',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    title: 'Expert Care',
    text: 'Connect with verified and experienced healthcare professionals',
  },
];

const BG = { blue: 'bg-blue-500/20 text-blue-400', green: 'bg-green-500/20 text-green-400', purple: 'bg-purple-500/20 text-purple-400' };

const FeatureCard = ({ accent, iconPath, title, text }) => (
  <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${BG[accent]}`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
      </svg>
    </div>
    <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
    <p className="text-gray-400 text-sm">{text}</p>
  </div>
);

const PlatformFeatures = () => (
  <div className="text-center space-y-8">
    <h3 className="text-2xl font-bold text-white mb-8">Platform Features</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {FEATURES.map((f, i) => <FeatureCard key={i} {...f} />)}
    </div>
  </div>
);

export default PlatformFeatures;
