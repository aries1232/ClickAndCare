import React from 'react';
import { assets } from '../assets/assets.js';
import RelatedDoctors from '../Components/RelatedDoctors.jsx';
import LoadingSpinner from '../Components/LoadingSpinner.jsx';
import { useAppointmentBooking } from '../hooks/useAppointmentBooking';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Appointment = () => {
  const {
    docId,
    docInfo,
    docSlot,
    slotIndex,
    setSlotIndex,
    slotTime,
    setSlotTime,
    isBooking,
    bookAppointment,
  } = useAppointmentBooking();

  if (!docInfo) return null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
        </div>

        <div className="flex-1 border-gray-400 rounded-lg p-8 py-7 bg-white dark:bg-gray-800 mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900 dark:text-white">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div>
            <p className="flex items-center gap-2 text-sm mt-1 text-gray-600 dark:text-white">
              {docInfo.degree} - {docInfo.speciality}
              <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
              About
              <img src={assets.info_icon} alt="" />
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-white max-w-[700px] mt-1">{docInfo.about}</p>
          </div>
          <div>
            <p>Appointment Fee : {docInfo.fees}</p>
          </div>
        </div>
      </div>

      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 dark:text-white">
        <p>Booking Slots</p>
        <div className="flex flex-row gap-3 items-center rounded-sm w-full mt-4">
          {docSlot.length > 0 && docSlot.map((item, index) => (
            <div
              key={index}
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'
              }`}
            >
              <p className="mt-0 my-5">{item[0] && DAYS_OF_WEEK[item[0].dateTime.getDay()]}</p>
              <p className="mb-0 ">{item[0] && item[0].dateTime.getDate()}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlot.length > 0 && docSlot[slotIndex]?.map((item, index) => (
            <p
              key={index}
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300 dark:text-white'
              }`}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button
          onClick={bookAppointment}
          disabled={isBooking}
          className={`text-sm font-light px-14 py-3 rounded-full mt-5 flex items-center justify-center gap-2 ${
            isBooking ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'
          } text-white`}
        >
          {isBooking ? (
            <>
              <LoadingSpinner size="w-4 h-4" />
              Booking Appointment...
            </>
          ) : (
            'Book an Appointment'
          )}
        </button>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
