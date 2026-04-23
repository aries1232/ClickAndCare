import React from 'react';
import LandingHero from '../components/landing/LandingHero.jsx';
import AccessCards from '../components/landing/AccessCards.jsx';
import PlatformFeatures from '../components/landing/PlatformFeatures.jsx';

const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl w-full space-y-12">
      <LandingHero />
      <AccessCards />
      <PlatformFeatures />
    </div>
  </div>
);

export default LandingPage;
