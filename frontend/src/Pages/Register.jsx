import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

import logo from '../assets/logo.png'

const eyeOpen = (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#4F46E5" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3" stroke="#4F46E5" strokeWidth="2"/></svg>
)
const eyeClosed = (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#4F46E5" strokeWidth="2" d="M3 3l18 18M1 12s4-7 11-7c2.5 0 4.6.7 6.3 1.7M23 12s-4 7-11 7c-2.5 0-4.6-.7-6.3-1.7"/><circle cx="12" cy="12" r="3" stroke="#4F46E5" strokeWidth="2"/></svg>
)

const Register = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [emailVerifying, setEmailVerifying] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [tempUserId, setTempUserId] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleGoogleSignup = async (credentialResponse) => {
    try {
      setGoogleLoading(true)
      const { credential } = credentialResponse
      
      // Decode the JWT token from Google
      const decodedToken = JSON.parse(atob(credential.split('.')[1]))
      
      const { data } = await axios.post(backendUrl + '/api/user/google-login', {
        googleId: decodedToken.sub,
        email: decodedToken.email,
        name: decodedToken.name,
        imageUrl: decodedToken.picture
      })
      
      if (data.success) {
        localStorage.setItem('token', data.token)
        toast.success("Account created with Google!")
        navigate('/')
      } else {
        toast.error(data.message || "Failed to create account with Google")
      }
    } catch (error) {
      console.error('Google signup error:', error)
      toast.error(error.response?.data?.message || 'Google signup failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const sendEmailOTP = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address first')
      return
    }

    if (!formData.name) {
      toast.error('Please enter your name first')
      return
    }

    if (!formData.password) {
      toast.error('Please enter your password first')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setEmailVerifying(true)
    
    try {
      const { data } = await axios.post(backendUrl + '/api/user/register', {
        name: formData.name,
        email: formData.email,
        phone: '0000000000', // Temporary phone number since backend requires it
        password: formData.password
      })

      if (data.success) {
        setTempUserId(data.userId)
        setOtpSent(true)
        toast.success('OTP sent to your email. Please verify your email.')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setEmailVerifying(false)
    }
  }

  const verifyEmailOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setEmailVerifying(true)
    
    try {
      const { data } = await axios.post(backendUrl + '/api/user/verify-otp', {
        userId: tempUserId,
        otp: otp
      })

      if (data.success) {
        setEmailVerified(true)
        toast.success('Email verified successfully!')
        // Store the token for immediate login
        localStorage.setItem('token', data.token)
        // Redirect to home page
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      toast.error(error.response?.data?.message || 'Failed to verify OTP. Please try again.')
    } finally {
      setEmailVerifying(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    if (!emailVerified) {
      toast.error('Please verify your email first')
      return
    }

    // If email is verified, user is already registered and logged in
    // This function won't be called since the button will be disabled
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="Click&Care" className="w-32 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-600">Join Click&Care to book appointments with top doctors</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input 
                id="name"
                type="text" 
                name="name"
                placeholder="Enter your full name" 
                value={formData.name} 
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none bg-white"
              />
            </div>

            {/* Email Input with Verify Button */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex gap-2">
              <input 
                  id="email"
                type="email" 
                name="email"
                  placeholder="Enter your email" 
                value={formData.email} 
                onChange={handleChange}
                required
                  disabled={emailVerified}
                  className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none bg-white ${
                    emailVerified ? 'bg-green-50 border-green-300' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={sendEmailOTP}
                  disabled={emailVerifying || emailVerified || !formData.email}
                  className="px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {emailVerified ? '✓ Verified' : emailVerifying ? 'Sending...' : 'Verify'}
                </button>
              </div>
            </div>

            {/* OTP Input (shown after email verification is initiated) */}
            {otpSent && !emailVerified && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification OTP
                </label>
                <div className="flex gap-2">
              <input 
                    id="otp"
                    type="text" 
                    placeholder="Enter 6-digit OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none bg-white text-center text-lg tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={verifyEmailOTP}
                    disabled={emailVerifying || !otp || otp.length !== 6}
                    className="px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {emailVerifying ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Check your email for the verification code
                </p>
            </div>
            )}

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
              <input 
                  id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                  placeholder="Enter password (min 8 characters)" 
                value={formData.password} 
                onChange={handleChange}
                required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none pr-12 bg-white"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword((prev) => !prev)} 
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
              </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={!emailVerified || loading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : emailVerified ? (
                'Account Created Successfully!'
              ) : (
                'Verify Email to Continue'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>
          </div>

          {/* Google Signup */}
          <div className="mt-6">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={() => {
                  toast.error('Google signup failed. Please try again.');
                }}
                useOneTap
                theme="outline"
                shape="pill"
                text="signup_with"
                logo_alignment="center"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
            >
              Sign in to your account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register