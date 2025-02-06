import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'

const MyAppointment = () => {

  const {doctors} = useContext(AppContext)
  return (
    <div>
      
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {doctors.slice(0,3).map((item, index)=>(
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b ' key={index}>
            <div className=''>
              <img className='w-32 bg-blue-50 ' src={item.image} alt="" />
            </div>

            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold '>{item.name}</p>
              <p className='text-gray-400'>{item.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address : </p>
              <p className='text-xs'>{item.address.line1}</p>
              <p className='text-xs'>{item.address.line2}</p>
              <p  className='text-sm mt-1'>
                <span className='text-sm text-neutral-700 font-medium' >Date & Time : </span>
                14 Dec 2024
              </p>
            </div>
            <div className=' flex flex-col gap-2 justify-end '>
              <button className='text-sm text-stone-400 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Now</button>
              <button className='text-sm text-stone-400 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600  hover:text-white transition-all duration-300'>Cancel Appointment</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointment;