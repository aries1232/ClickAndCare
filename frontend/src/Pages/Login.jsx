import React, { useState } from 'react'
import './login.css'
import name_icon from '../assets/user (1).png'
import mail_icon from '../assets/mail.png'
import password_icon from '../assets/password.png'

const Login = () => {
  const [action ,setAction]=useState("Login");
  return (
    <div className='container'>
      <div className="header">
       <div className="text">{action}</div> 
       <div className="underline"></div>
      </div>
      <div className="inputs">
        {action=="Login"? <div></div>: <div className="input">
          <img src="{name_icon}" alt="" />
          <input type="name" placeholder='Name' />
        </div> }
       

        <div className="input">
          <img src="{mail_icon}" alt="" />
          <input type="email" placeholder='Email'/>
        </div>

        <div className="input">
          <img src="{password_icon}" alt="" />
          <input type="password" placeholder='Password' />
        </div>
      </div>
      {action==="Sign Up"? <div></div>: <div className="forgot-password">Lost Password? <span>Click here</span></div>}
     
      <div className="submit-container">
        <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>SignUp</div>
        <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
      </div>
    </div>
  )
}

export default Login