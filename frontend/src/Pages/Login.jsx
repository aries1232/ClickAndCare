import React, { useContext, useEffect, useState } from 'react'
import './login.css'

import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    
    try {
      const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success("Login Success")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // top : '500px'
      minHeight : '100vh'
    }}>
      <div style={{
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
        <div className="header">
          <img src={logo} alt="Logo" style={{ width: 120, height: 60, marginBottom: 0 }} />
          {/* <div className="text" style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 30, color: '#234', letterSpacing: 1 }}>Click&Care</div> */}
          {/* <div className="underline" style={{ margin: '0 auto', marginTop: 4, marginBottom: 8, width: 60, height: 4, background: '#4F46E5', borderRadius: 2 }}></div> */}
          <div className="underline"></div>
        </div>
        <div style={{ color: '#6b7280', fontSize: 15, marginBottom: 8, textAlign: 'center' }}>Login to your Account</div>
        
        <form onSubmit={onSubmitHandler} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="inputs" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input">
              <input 
                type="email" 
                placeholder='Email Address' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ddd' }}
              />
            </div>

            <div className="input" style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder='Password' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #ddd' }}
              />
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', fontSize: '12px' }}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          
          <div className="forgot-password" style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>Lost Password? <span style={{ color: '#4F46E5', cursor: 'pointer' }}>Click here</span></div>

          <div className="submit-container" style={{ marginTop: 8 }}>
            <button 
              type="submit" 
              className="submit" 
              disabled={loading}
              style={{ 
                width: '100%',
                padding: '12px',
                background: '#17de71',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 2px 8px rgba(79,70,229,0.08)'
              }}
              onMouseOver={e => e.target.style.background = '#0fbd5e'}
              onMouseOut={e => e.target.style.background = '#17de71'}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ color: '#666' }}>Don't have an account? </span>
          <span 
            style={{ color: '#4F46E5', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </div>
      </div>
    </div>
  )
}

export default Login
