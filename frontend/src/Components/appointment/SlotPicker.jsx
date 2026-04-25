import React from 'react';
import LoadingSpinner from '../LoadingSpinner.jsx';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SlotPicker = ({ docSlot, slotIndex, setSlotIndex, slotTime, setSlotTime, isBooking, onBook }) => (
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
      onClick={onBook}
      disabled={isBooking}
      className={`text-sm font-semibold px-14 py-3 rounded-full mt-5 flex items-center justify-center gap-2 shadow-md shadow-primary/30 transition-all duration-200 ${
        isBooking
          ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
          : 'bg-primary hover:bg-emerald-500 active:scale-[0.98] !text-white dark:!text-white'
      }`}
    >
      {isBooking ? (<><LoadingSpinner size="w-4 h-4" />Booking Appointment...</>) : 'Book an Appointment'}
    </button>
  </div>
);

export default SlotPicker;
