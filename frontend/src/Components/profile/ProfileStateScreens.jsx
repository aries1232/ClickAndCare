import React from 'react';

export const ProfileLoading = () => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
    </div>
  </div>
);

export const ProfileLoginPrompt = ({ onGoToLogin }) => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center max-w-md mx-auto px-6">
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Please Login</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">You need to be logged in to view and manage your profile.</p>
      <button onClick={onGoToLogin} className="bg-primary text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-200">
        Go to Login
      </button>
    </div>
  </div>
);

export const ProfileLoadError = ({ onRefresh }) => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center max-w-md mx-auto px-6">
      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Profile Not Found</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Unable to load your profile data. Please try refreshing the page.</p>
      <button onClick={onRefresh} className="bg-primary text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors duration-200">
        Refresh Page
      </button>
    </div>
  </div>
);
