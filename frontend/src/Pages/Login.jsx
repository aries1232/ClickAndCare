import React, { useContext, useEffect, useState } from 'react'
import './login.css'

import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
 const navigate=useNavigate()
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      if (action === "Sign Up") {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success("User Registered Successfully")
        } else {

          toast.error(data.message)
       
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success("Login Success")
        } else {
      
          toast.error(data.message)
         

        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Login" ? <div></div> : <div className="input">
   
          <input type="name" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
        </div>}

        <div className="input">
     
          <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="input">
    
          <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </div>
      {action === "Sign Up" ? <div></div> : <div className="forgot-password">Lost Password? <span>Click here</span></div>}

      <div className="submit-container">
        <div type="button" className={action === "Login" ? "submit gray" : "submit"} onClick={(e) => { if(action=="Sign Up"){ onSubmitHandler(e) } else{setAction("Sign Up")} }}>Sign Up</div>
        <div type="button" className={action === "Sign Up" ? "submit gray" : "submit"} onClick={(e) => { if(action=="Login"){ onSubmitHandler(e) } else{setAction("Login")} }}>Login</div>
      </div>
    </div>
  )
}

export default Login
