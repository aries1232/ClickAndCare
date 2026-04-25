import React from 'react';
import { HiOutlineCalendar, HiOutlineCash, HiOutlineLocationMarker } from 'react-icons/hi';
import AppointmentStatusBadge from '../AppointmentStatusBadge.jsx';
import AppointmentActions from './AppointmentActions.jsx';
import { slotDateFormat } from '../../utils/dateUtils';

const FALLBACK_AVATAR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4=';

const Stat = ({ icon: Icon, label, value, valueClass = '' }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase">
        {label}
      </p>
      <p className={`text-sm font-semibold text-gray-900 dark:text-white truncate ${valueClass}`}>
        {value}
      </p>
    </div>
  </div>
);

const AppointmentCard = ({ appointment, unreadCount, onCancel, onOpenChat }) => {
  const address = appointment.docData.address?.address
    || appointment.docData.address?.line1
    || 'Address not available';

  return (
    <article className="rounded-2xl bg-white dark:bg-gray-800/60 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
          {/* Doctor photo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 bg-gradient-to-br from-primary/10 to-emerald-100 dark:from-primary/10 dark:to-emerald-900/20">
              <img
                className="w-full h-full object-cover"
                src={appointment.docData.image}
                alt={appointment.docData.name}
                onError={(e) => { e.target.src = FALLBACK_AVATAR; }}
              />
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {appointment.docData.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                  {appointment.docData.speciality}
                </p>
              </div>
              <AppointmentStatusBadge appointment={appointment} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Stat
                icon={HiOutlineCalendar}
                label="Date & Time"
                value={`${slotDateFormat(appointment.slotDate)} • ${appointment.slotTime}`}
              />
              <Stat
                icon={HiOutlineCash}
                label="Consultation Fee"
                value={`₹${appointment.amount}`}
                valueClass="text-primary"
              />
              <div className="sm:col-span-2">
                <Stat
                  icon={HiOutlineLocationMarker}
                  label="Clinic Address"
                  value={address}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
          <AppointmentActions
            appointment={appointment}
            unreadCount={unreadCount}
            onCancel={onCancel}
            onOpenChat={onOpenChat}
          />
        </div>
      </div>
    </article>
  );
};

export default AppointmentCard;
