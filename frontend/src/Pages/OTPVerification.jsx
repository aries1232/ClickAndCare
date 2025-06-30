import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import './login.css'

const OTPVerification = () => {
  const { backendUrl, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    // Check if user has tempUserId (came from registration)
    const tempUserId = localStorage.getItem('tempUserId')
    if (!tempUserId) {
      toast.error('Please register first')
      navigate('/register')
      return
    }

    // Start countdown for resend OTP
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 6) {
      setOtp(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP')
      return
    }

    const tempUserId = localStorage.getItem('tempUserId')
    if (!tempUserId) {
      toast.error('Session expired. Please register again.')
      navigate('/register')
      return
    }

    setLoading(true)
    
    try {
      const { data } = await axios.post(backendUrl + '/api/user/verify-otp', {
        userId: tempUserId,
        otp: otp
      })

      if (data.success) {
        toast.success(data.message)
        // Store token and clear temp userId
        localStorage.setItem('token', data.token)
        localStorage.removeItem('tempUserId')
        setToken(data.token)
        // Redirect to home page
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      toast.error(error.response?.data?.message || 'OTP verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    const tempUserId = localStorage.getItem('tempUserId')
    if (!tempUserId) {
      toast.error('Session expired. Please register again.')
      navigate('/register')
      return
    }

    setResendLoading(true)
    
    try {
      const { data } = await axios.post(backendUrl + '/api/user/resend-otp', {
        userId: tempUserId
      })

      if (data.success) {
        toast.success(data.message)
        setCountdown(60) // Reset countdown
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className='container'>
      <div className="header">
        <div className="text">Verify Email</div>
        <div className="underline"></div>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>
          We've sent a 6-digit verification code to your email address.
        </p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Please enter the code below to verify your account.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <div className="input" style={{ textAlign: 'center' }}>
            <input 
              type="text" 
              placeholder='Enter 6-digit OTP' 
              value={otp} 
              onChange={handleOtpChange}
              maxLength="6"
              style={{ 
                textAlign: 'center', 
                fontSize: '24px', 
                letterSpacing: '8px',
                fontWeight: 'bold'
              }}
              required
            />
          </div>
        </div>

        <div className="submit-container">
          <button 
            type="submit" 
            className="submit" 
            disabled={loading || otp.length !== 6}
            style={{ 
              width: '100%', 
              cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
              opacity: (loading || otp.length !== 6) ? 0.7 : 1
            }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ color: '#666', fontSize: '12px', marginBottom: '10px' }}>
          Didn't receive the code?
        </p>
        <button
          onClick={handleResendOTP}
          disabled={resendLoading || countdown > 0}
          style={{
            background: 'none',
            border: 'none',
            color: countdown > 0 ? '#999' : '#4F46E5',
            cursor: (resendLoading || countdown > 0) ? 'not-allowed' : 'pointer',
            textDecoration: 'underline',
            fontSize: '14px'
          }}
        >
          {resendLoading 
            ? 'Sending...' 
            : countdown > 0 
              ? `Resend in ${countdown}s` 
              : 'Resend OTP'
          }
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <span 
          style={{ color: '#4F46E5', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => {
            localStorage.removeItem('tempUserId')
            navigate('/register')
          }}
        >
          Back to Registration
        </span>
      </div>
    </div>
  )
}

export default OTPVerification 