import React from 'react'
import { assets } from '../assets/assets.js'

const Header = () => {
  return (
    <div>
       //left 
       <div>
          <p>Book Appointment with <br/> Best from the Industry !</p>
       </div>

       <div>
        <p>Simply browse through our extensive list of trusted doctors, <br/> 
        schedule your appointment hassle-free.</p>
       </div>
       <a href=''>
        Book Appointment <img src={assets.arrow_icon}></img>
       </a>

       //right
       <div>

       </div>

    </div>
  )
}

export default Header