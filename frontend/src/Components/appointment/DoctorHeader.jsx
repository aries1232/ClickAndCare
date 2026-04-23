import React from 'react';
import { assets } from '../../assets/assets.js';

const DoctorHeader = ({ docInfo }) => (
  <div className="flex flex-col sm:flex-row gap-4">
    <div>
      <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
    </div>

    <div className="flex-1 border-gray-400 rounded-lg p-8 py-7 bg-white dark:bg-gray-800 mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
      <p className="flex items-center gap-2 text-2xl font-medium text-gray-900 dark:text-white">
        {docInfo.name}
        <img className="w-5" src={assets.verified_icon} alt="" />
      </p>
      <p className="flex items-center gap-2 text-sm mt-1 text-gray-600 dark:text-white">
        {docInfo.degree} - {docInfo.speciality}
        <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
      </p>
      <p className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
        About
        <img src={assets.info_icon} alt="" />
      </p>
      <p className="text-sm text-gray-500 dark:text-white max-w-[700px] mt-1">{docInfo.about}</p>
      <p>Appointment Fee : {docInfo.fees}</p>
    </div>
  </div>
);

export default DoctorHeader;
