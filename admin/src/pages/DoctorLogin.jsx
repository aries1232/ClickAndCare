import React, { useContext, useState, useEffect } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DoctorLogin = () => {
    const { dToken, setDToken, backendUrl } = useContext(DoctorContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if already logged in as doctor
    useEffect(() => {
        if (dToken) {
            navigate('/doctor/dashboard');
        }
    }, [dToken, navigate]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password });
            
            if (data.success) {
                localStorage.setItem('dToken', data.token);
                setDToken(data.token);
                toast.success('Doctor login successful!');
                navigate('/doctor/dashboard');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/25">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Doctor Login
                    </h2>
                    <p className="text-gray-300">
                        Access your doctor dashboard
                    </p>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50">
                    <form onSubmit={onSubmitHandler} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        value={email} 
                                        className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                                        type="email" 
                                        placeholder="doctor@example.com"
                                        required 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        value={password} 
                                        className="w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
                                        type="password" 
                                        placeholder="Enter your password"
                                        required 
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl shadow-green-500/25"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </div>
                            ) : (
                                'Login as Doctor'
                            )}
                        </button>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-400">
                                Admin? <span onClick={() => navigate('/admin-login')} className="text-green-400 cursor-pointer hover:text-green-300 font-medium transition-colors">Login here</span>
                            </p>
                            <p className="text-sm text-gray-400">
                                New Doctor? <span onClick={() => navigate('/doctor-signup')} className="text-green-400 cursor-pointer hover:text-green-300 font-medium transition-colors">Register here</span>
                            </p>
                            <p className="text-sm text-gray-400">
                                <span onClick={() => navigate('/')} className="text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">← Back to home</span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DoctorLogin; 