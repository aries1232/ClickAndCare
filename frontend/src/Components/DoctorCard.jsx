import React from 'react';
import { useNavigate } from 'react-router-dom';

const FALLBACK_AVATAR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDMwIDEwMEMxMzAgMTE2LjU2OSAxMTYuNTY5IDEzMCAxMDAgMTMwQzgzLjQzMSAxMzAgNzAgMTE2LjU2OSA3MCAxMEM3MCA4My40MzEgODMuNDMxIDcwIDEwMCA3MFoiIGZpbGw9IiNEMzQ1NEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzExNi41NjkgMTMwIDEzMCAxNDMuNDMxIDEzMCAxNjBDMTMwIDE3Ni41NjkgMTE2LjU2OSAxOTAgMTAwIDE5MEM4My40MzEgMTkwIDcwIDE3Ni41NjkgNzAgMTYwQzcwIDE0My40MzEgODMuNDMxIDEzMCAxMDAgMTMwWiIgZmlsbD0iI0QzNDU0RjYiLz4KPC9zdmc+';

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo(0, 0);
    navigate(`/appointment/${doctor._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 sm:hover:-translate-y-[10px] transition-all duration-500 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg"
    >
      <div className="relative aspect-[3/2] sm:aspect-auto sm:h-48 bg-blue-50 overflow-hidden">
        <img
          className="w-full h-full object-cover object-top"
          src={doctor.image}
          alt={doctor.name}
          onError={(e) => { e.target.src = FALLBACK_AVATAR; }}
        />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <span
            className={`text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${
              doctor.available ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {doctor.available ? 'Available' : 'Off'}
          </span>
        </div>
      </div>
      <div className="p-2 sm:p-4">
        <p className="text-gray-900 dark:text-white text-[12px] sm:text-lg font-semibold leading-tight truncate">{doctor.name}</p>
        <p className="text-gray-600 dark:text-gray-300 text-[10px] sm:text-sm mt-0.5 mb-1 sm:mb-2 truncate">{doctor.speciality}</p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-semibold text-[12px] sm:text-base">₹{doctor.fees}</span>
          <span className="hidden sm:inline text-xs text-gray-500">Consultation</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
