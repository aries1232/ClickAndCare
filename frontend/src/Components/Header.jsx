import React from 'react'
import { assets } from '../assets/assets.js'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 '>
       {/* ------------- left ------------ */}
      <div className='w-1/2 flex flex-col  items-start justify-center gap-4 py-5 m-auto md:py-[10vw] md:mb-[-30px]'>
          <p className='text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight md:leading-tight lg:leading-tight'>Book Appointment  <br/>
           from the Best In Industry !</p>
       

          <div className='text-white text-sm'>
              <p className='hidden sm:block'>Simply browse through our extensive list of trusted doctors, <br/> 
              schedule your appointment hassle-free.</p>
          </div> 

          <a href= "#speciality" className='flex items-center gap-4 px-8 py-3 rounded-full bg-white hover:scale-105 transtion-all duration-500'>
              Book Appointment <img src={assets.arrow_icon}></img>
          </a>
      </div>

       {/* --------------- //right  --------------- */}
      <div className='md:w-1/2 relative'>
        <img  className= "w-full md:absolute bottom-0 h-auto rounded-lg" src={assets.header_img} alt="" />
      </div>

    </div>
  )
}

export default Header