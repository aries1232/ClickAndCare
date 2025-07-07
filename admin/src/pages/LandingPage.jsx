import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-12">
                <div className="text-center space-y-6">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/25">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        ClickAndCare
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Your trusted healthcare platform connecting patients with qualified doctors
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
                        <div className="text-center space-y-6">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/25">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Admin Access
                                </h2>
                                <p className="text-gray-300 mb-6">
                                    Manage doctors, appointments, and system settings
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/admin-login')}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-blue-500/25"
                            >
                                Login as Admin
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105">
                        <div className="text-center space-y-6">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/25">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Doctor Access
                                </h2>
                                <p className="text-gray-300 mb-6">
                                    Manage your appointments and patient care
                                </p>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/doctor-login')}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-green-500/25"
                                >
                                    Login as Doctor
                                </button>
                                <button
                                    onClick={() => navigate('/doctor-signup')}
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-purple-500/25"
                                >
                                    Register as Doctor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-8">
                    <h3 className="text-2xl font-bold text-white mb-8">
                        Platform Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">Easy Scheduling</h4>
                            <p className="text-gray-400 text-sm">Book appointments with qualified doctors quickly and easily</p>
                        </div>
                        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">Secure Platform</h4>
                            <p className="text-gray-400 text-sm">Your health information is protected with industry-standard security</p>
                        </div>
                        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2">Expert Care</h4>
                            <p className="text-gray-400 text-sm">Connect with verified and experienced healthcare professionals</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage; 