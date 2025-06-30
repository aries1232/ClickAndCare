import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import './login.css'
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
    phone: '',
    password: '',
    // confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password ) {
      toast.error('Please fill in all fields')
      return
    }

    // if (formData.password !== formData.confirmPassword) {
    //   toast.error('Passwords do not match')
    //   return
    // }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    // Phone number validation (basic)
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    
    try {
      const { data } = await axios.post(backendUrl + '/api/user/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })

      if (data.success) {
        toast.success(data.message)
        // Store userId in localStorage for OTP verification
        localStorage.setItem('tempUserId', data.userId)
        // Redirect to OTP verification page
        navigate('/verify-otp')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // top : '500px'
      minHeight : '100vh'
    }}>
      <div style={{
        // height : '50vh',
        width: '50%',
        maxWidth: 500,
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 6px 24px rgba(79,70,229,0.10)',
        padding: 8,
        margin: '8px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        alignItems: 'center',
      }}>
        <img src={logo} alt="Logo" style={{ width: 120, height: 60}} />
        {/* <div className="header" style={{ textAlign: 'center', width: '100%' }}> */}
          {/* <div className="text" style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 30, color: '#234', letterSpacing: 1 }}>Register</div> */}
          {/* <div className="underline" style={{ margin: '0 auto', marginTop: 4, marginBottom: 8, width: 60, height: 4, background: '#4F46E5', borderRadius: 2 }}></div> */}
        {/* </div> */}
        <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 8, textAlign: 'center' }}>Create your account</div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '80%' }}>
          <div className="inputs" style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', justifyContent: 'centre' }}>
            <div className="input">
              <input 
                type="text" 
                name="name"
                placeholder='Full Name' 
                value={formData.name} 
                onChange={handleChange}
                required
                style={{ width: '95%', padding: '10px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 15, background: '#f3f4f6', transition: 'border 0.2s', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.border = '1.5px solid #4F46E5'}
                onBlur={e => e.target.style.border = '1.5px solid #e5e7eb'}
              />
            </div>
            <div className="input">
              <input 
                type="email" 
                name="email"
                placeholder='Email Address' 
                value={formData.email} 
                onChange={handleChange}
                required
                style={{ width: '95%', padding: '10px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 15, background: '#f3f4f6', transition: 'border 0.2s', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.border = '1.5px solid #4F46E5'}
                onBlur={e => e.target.style.border = '1.5px solid #e5e7eb'}
              />
            </div>
            <div className="input">
              <input 
                type="tel" 
                name="phone"
                placeholder='Phone Number (10 digits)' 
                value={formData.phone} 
                onChange={handleChange}
                maxLength="10"
                required
                style={{ width: '95%', margin : '2px', padding: '10px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 15, background: '#f3f4f6', transition: 'border 0.2s', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.border = '1.5px solid #4F46E5'}
                onBlur={e => e.target.style.border = '1.5px solid #e5e7eb'}
              />
            </div>
            <div className="input" style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder='Password (min 8 characters)' 
                value={formData.password} 
                onChange={handleChange}
                required
                style={{ width: '95%', padding: '12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 15, background: '#f3f4f6', transition: 'border 0.2s', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.border = '1.5px solid #4F46E5'}
                onBlur={e => e.target.style.border = '1.5px solid #e5e7eb'}
                
              />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} style={{ position: 'absolute', right: '8%', top: '45%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                {showPassword ? eyeOpen : eyeClosed}
              </button>
            </div>
            {/* <div className="input" style={{ position: 'relative' }}>
              <input 
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder='Confirm Password' 
                value={formData.confirmPassword} 
                onChange={handleChange}
                required
                style={{ width: '95%', padding: '12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 15, background: '#f3f4f6', transition: 'border 0.2s', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.border = '1.5px solid #4F46E5'}
                onBlur={e => e.target.style.border = '1.5px solid #e5e7eb'}
              />
              <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {showConfirmPassword ? eyeOpen : eyeClosed}
              </button>
            </div> */}
          </div>
          <div className="verification-notice">
            <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', marginTop: '10px' }}>
              After registration, you'll receive an OTP on your email to verify your account.
            </p>
          </div>
          <div className="submit-container" style={{ marginTop: 8 }}>
            <button 
              type="submit" 
              className="submit" 
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '14px',
                background: '#17de71',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 17,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 2px 8px rgba(79,70,229,0.10)',
                letterSpacing: 1,
                transition: 'background 0.2s',
                
              }}
              onMouseOver={e => e.target.style.background = '#0fbd5e'}
              onMouseOut={e => e.target.style.background = '#17de71'}
              
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <div style={{ textAlign: 'center', marginTop: '2px' }}>
          <span style={{ color: '#666' }}>Already have an account? </span>
          <span 
            style={{ color: '#4F46E5', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </div>
      </div>
    </div>
  )
}

export default Register