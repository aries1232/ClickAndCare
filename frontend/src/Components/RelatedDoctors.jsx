import React, { useContext, useEffect, useState } from 'react'
import { doctors } from "../assets/assets";
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({speciality, docId}) => {

    const {doctors} = useContext(AppContext)
    const navigate = useNavigate()

    const [relDoc, setRelDoc] = useState ([])

    useEffect(()=>{
        if(doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc)=> doc.speciality === speciality && doc._id != docId)
            // doc._id has been compared to exclude the current doctor 
            // We need to fetch doctors with same speciality
            setRelDoc(doctorsData)
        } 

    },[doctors, speciality, docId])

    return(

        // Below code has been taken from top doctors section as both have the same logic
        <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
            <h1 className="text-3xl font-medium">Related Doctors</h1>
            <p className="sm:w-1/3 text-center text-sm">Dive to experience.. Choose the best</p>
            <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                {
                   relDoc.slice(0,6).map((doctor, index) => (
                    <div
                      key={index}
                      onClick={() => navigate(`/appointment/${doctor._id}`)}
                      className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                    >
                      <img className="bg-blue-50" src={doctor.image} alt="" />
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-sm text-center text-green-500 ">
                          <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                          <p>Available</p>
                        </div>
                        <p className="text-gray-900 text-lg font-medium">{doctor.name}</p>
                        <p className="text-gray-600 text-sm">{doctor.speciality}</p>
                      </div>
                    </div>
                  ))
                }
            </div>
        </div>
      )
}

export default RelatedDoctors
