import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import {AppContext} from '../context/AppContext.jsx'
import RelatedDoctors from '../Components/RelatedDoctors.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'

 

//It will be imported after preaprtion of context page

const Appointment = () => {

  const {docId} = useParams()
  const {doctors ,currencySymbol ,backendUrl,token, getDoctors} = useContext(AppContext) //Context is not available yet. It will be made by Ashutosh
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const navigate =useNavigate()


  const [docInfo, setDocInfo] = useState(null)
  const [docSlot, setDocSlot] =useState([]);
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async() =>{
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
    console.log(docInfo)
  }

 


  // getting slots of doctors using date and time//
  const getAvailableSlots = async()=>{
    setDocSlot([])

    let today = new Date()

    // The below code is written to move the date to next date if todays time is mire than 7.30
  
    let flag = false;
    if (today.getHours() > 19 || (today.getHours() === 19 && today.getMinutes() > 30)) {
      today.setDate(today.getDate() + 1); 
      flag = true;
    }
    // The logic is to use a flag variable to get track if next date is thenew date

    let currentDate = new Date(today);

    

    for(let i=0; i<7; i++){
      
      currentDate.setDate(today.getDate()+i);

      let endTime= new Date();
      endTime.setDate(today.getDate()+ i)
      endTime.setHours(20,0,0,0)

      //This if condition checks whether it is todays date or tommorow. If it is tommorows date then it will start new time slots from 10 am
      if(flag){
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
        
      else if(today.getDate() === currentDate.getDate() ){
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours()+1 : 10)
        currentDate.setMinutes(currentDate.getMinutes()>30 ? 30: 0)
      }
      else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []
      while(currentDate < endTime ){
        let formattedTime = currentDate.toLocaleTimeString([], {hour : '2-digit', minute : '2-digit'})

        let day = currentDate.getDate();
        let month = currentDate.getMonth()+1;
        let year  = currentDate.getFullYear();

        let slotDate = day+"_"+month+"_"+year;
        let slotTime = formattedTime;

        let isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

        if(isSlotAvailable){
          timeSlots.push({
            dateTime : new Date(currentDate),
            time : formattedTime
          })

        }

        currentDate.setMinutes(currentDate.getMinutes()+30)
      }

      setDocSlot(prev=> ([...prev, timeSlots]))
    }
  }


  // booking appointment
  const bookAppointment= async()=>{
    if(!token){
      toast.warn('Login to book appointment')
       return navigate('/login')
    }

    try {
      const date=docSlot[slotIndex][0].dateTime
      let day =date.getDate()
      let month= date.getMonth()+1
      let year =date.getFullYear()
       
      const slotDate=day+"_"+month+"_"+year

      //console.log("before");
      const {data}=await axios.post(backendUrl+'/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})
       
      if(data.success){
        toast.success(data.message)
        getDoctors();
        navigate('/my-appointments');
      }
      else{
          //console.log("data nhi mila :)");
          toast.error(data.message)
      }
    } catch (error) {
      //console.log("backend pe gya hi nhi !")
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    fetchDocInfo()
  },[doctors,docId])

  useEffect(()=>{
    if(docInfo){  
      getAvailableSlots()
    }
  },[docInfo])

  useEffect(()=>{
    console.log(docSlot)
  },[docSlot])
  



  return docInfo && (
    <div>
      {/* Doctors Details */}
      <div className='flex flex-col sm:flex-row gap-4'>
        {/* Doctor Image */}
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>

        {/* Doctor Name  Degrree*/}
        <div className='flex-1 border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

          {/* Name Degree About Fee */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div>
            <p className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              {docInfo.degree} - {docInfo.speciality}
              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            </p>
          </div>
          <div>

            <p className='flex items-center gap-1 text-sm font-medium text-gray-900'>
              About 
              <img src={assets.info_icon} alt="" />
            </p>
          </div>

          <div>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>

          <div>
            <p>
              Appointment Fee : 
              {docInfo.fees}
            </p>
          </div>
        </div>
      </div>

       
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex flex-row gap-3 items-center rounded-sm w-full mt-4'>
          {docSlot.length && docSlot.map((item, index)=>(
            
            <div onClick={()=> setSlotIndex(index)} className= {`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex=== index ? 'bg-primary text-white' : 'border border-gray-200'}`} key= {index}>
              <p className='mt-0 my-5'>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
              <p className='mb-0 '>{item[0] && item[0].dateTime.getDate()}</p>
            </div>

          ))}
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4' >
          {docSlot.length && docSlot[slotIndex].map((item, index)=>(
            <p key={index} onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}>
              {item.time.toLowerCase()}
            </p>
            
            
          ))}
        </div>
        <button onClick={bookAppointment}className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full mt-5'>Book an Appointment</button>
      </div>

      {/* Related Doctors Page Component*/}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default Appointment
