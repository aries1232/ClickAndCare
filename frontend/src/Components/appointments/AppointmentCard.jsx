import React from 'react';
import { HiOutlineCalendar, HiOutlineCash, HiOutlineLocationMarker } from 'react-icons/hi';
import AppointmentStatusBadge from '../AppointmentStatusBadge.jsx';
import AppointmentActions from './AppointmentActions.jsx';
import { slotDateFormat } from '../../utils/dateUtils';

const FALLBACK_AVATAR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4=';

// Mobile: tight inline label · value rows. Desktop: icon-tiled stat cards.
const InlineRow = ({ icon: Icon, label, value, valueClass = '' }) => (
  <div className="flex items-center gap-2 text-sm">
    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
    <span className="text-gray-500 dark:text-gray-400">{label}:</span>
    <span className={`font-medium text-gray-900 dark:text-white truncate ${valueClass}`}>{value}</span>
  </div>
);

const StatTile = ({ icon: Icon, label, value, valueClass = '' }) => (
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

  const dateValue = `${slotDateFormat(appointment.slotDate)} • ${appointment.slotTime}`;
  const feeValue = `₹${appointment.amount}`;

  return (
    <article className="rounded-2xl bg-white dark:bg-gray-800/60 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex gap-3 sm:gap-5 lg:gap-6">
          {/* Doctor photo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl sm:rounded-2xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 bg-gradient-to-br from-primary/10 to-emerald-100 dark:from-primary/10 dark:to-emerald-900/20">
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
            <div className="flex items-start justify-between gap-2 mb-2 sm:mb-4">
              <div className="min-w-0">
                <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {appointment.docData.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5 truncate">
                  {appointment.docData.speciality}
                </p>
              </div>
              <AppointmentStatusBadge appointment={appointment} />
            </div>

            {/* Mobile: compact inline rows */}
            <div className="sm:hidden space-y-1.5">
              <InlineRow icon={HiOutlineCalendar} label="When" value={dateValue} />
              <InlineRow icon={HiOutlineCash} label="Fee" value={feeValue} valueClass="text-primary" />
              <InlineRow icon={HiOutlineLocationMarker} label="At" value={address} />
            </div>

            {/* Desktop: icon-tiled stat cards */}
            <div className="hidden sm:grid grid-cols-2 gap-4">
              <StatTile icon={HiOutlineCalendar} label="Date & Time" value={dateValue} />
              <StatTile icon={HiOutlineCash} label="Consultation Fee" value={feeValue} valueClass="text-primary" />
              <div className="col-span-2">
                <StatTile icon={HiOutlineLocationMarker} label="Clinic Address" value={address} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:flex-wrap gap-2">
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
