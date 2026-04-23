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
      className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg"
    >
      <div className="relative h-48 bg-blue-50 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={doctor.image}
          alt={doctor.name}
          onError={(e) => { e.target.src = FALLBACK_AVATAR; }}
        />
        <div className="absolute top-3 right-3">
          <span
            className={`text-white text-xs px-2 py-1 rounded-full font-medium ${
              doctor.available ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {doctor.available ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-900 dark:text-white text-lg font-semibold mb-1">{doctor.name}</p>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{doctor.speciality}</p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-medium">₹{doctor.fees}</span>
          <span className="text-xs text-gray-500">Consultation</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
