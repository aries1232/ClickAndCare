import React from 'react';
import AppointmentStatusBadge from '../AppointmentStatusBadge.jsx';
import AppointmentActions from './AppointmentActions.jsx';
import { slotDateFormat } from '../../utils/dateUtils';

const FALLBACK_AVATAR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDMwIDEwMEMxMzAgMTE2LjU2OSAxMTYuNTY5IDEzMCAxMDAgMTMwQzgzLjQzMSAxMzAgNzAgMTE2LjU2OSA3MCAxMEM3MCA4My40MzEgODMuNDMxIDcwIDEwMCA3MFoiIGZpbGw9IiNEMzQ1NEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzExNi41NjkgMTMwIDEzMCAxNDMuNDMxIDEzMCAxNjBDMTMwIDE3Ni41NjkgMTE2LjU2OSAxOTAgMTAwIDE5MEM4My40MzEgMTkwIDcwIDE3Ni41NjkgNzAgMTYwQzcwIDE0My40MzEgODMuNDMxIDEzMCAxMDAgMTMwWiIgZmlsbD0iI0QzNDU0RjYiLz4KPC9zdmc+';

const AppointmentCard = ({ appointment, unreadCount, onPay, onCancel, onOpenChat }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
    <div className="p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            <img
              className="w-full h-full object-cover"
              src={appointment.docData.image}
              alt={appointment.docData.name}
              onError={(e) => { e.target.src = FALLBACK_AVATAR; }}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{appointment.docData.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{appointment.docData.speciality}</p>
            </div>
            <AppointmentStatusBadge appointment={appointment} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {slotDateFormat(appointment.slotDate)} | {appointment.slotTime}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-1">Consultation Fee</p>
              <p className="font-medium text-primary">₹{appointment.amount}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500 dark:text-gray-400 mb-1">Address</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {appointment.docData.address?.address || 'Address not available'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col gap-2">
          <AppointmentActions
            appointment={appointment}
            unreadCount={unreadCount}
            onPay={onPay}
            onCancel={onCancel}
            onOpenChat={onOpenChat}
          />
        </div>
      </div>
    </div>
  </div>
);

export default AppointmentCard;
