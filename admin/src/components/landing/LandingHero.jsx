import React from 'react';

const LandingHero = () => (
  <div className="text-center space-y-6">
    <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/25">
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>
    <h1 className="text-5xl font-bold text-white mb-4">ClickAndCare</h1>
    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
      Your trusted healthcare platform connecting patients with qualified doctors
    </p>
  </div>
);

export default LandingHero;
