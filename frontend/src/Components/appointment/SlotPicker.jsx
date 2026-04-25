import React from 'react';
import { HiOutlineArrowRight, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import LoadingSpinner from '../LoadingSpinner.jsx';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SectionLabel = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon className="w-4 h-4 text-primary" />
    <h3 className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
      {children}
    </h3>
  </div>
);

const SlotPicker = ({ docSlot, slotIndex, setSlotIndex, slotTime, setSlotTime, isBooking, onBook }) => {
  const hasSlots = docSlot.length > 0;
  const todaysSlots = hasSlots ? docSlot[slotIndex] || [] : [];
  const canBook = !!slotTime && !isBooking;

  return (
    <section className="mt-8 rounded-2xl p-6 sm:p-8 bg-white dark:bg-gray-800/60 ring-1 ring-gray-200 dark:ring-gray-700">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Book your slot</h2>
        {slotTime && (
          <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            {slotTime.toLowerCase()} selected
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Pick a date in the next 7 days, then choose an available time.
      </p>

      {/* ─── Date strip ──────────────────────────── */}
      <SectionLabel icon={HiOutlineCalendar}>Choose a date</SectionLabel>
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {hasSlots && docSlot.map((item, index) => {
          const day = item[0];
          if (!day) return null;
          const active = slotIndex === index;
          return (
            <button
              key={index}
              onClick={() => { setSlotIndex(index); setSlotTime(''); }}
              className={`flex-shrink-0 w-16 sm:w-[72px] py-3.5 rounded-2xl text-center transition-all duration-200 ${
                active
                  ? 'bg-primary !text-white shadow-md shadow-primary/30 ring-1 ring-primary scale-[1.02]'
                  : 'bg-gray-50 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary/40 hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              <p className={`text-[11px] font-medium uppercase tracking-wider ${active ? 'text-white/85' : 'text-gray-500 dark:text-gray-400'}`}>
                {DAYS_OF_WEEK[day.dateTime.getDay()]}
              </p>
              <p className="text-2xl font-bold mt-0.5 leading-none">
                {day.dateTime.getDate()}
              </p>
            </button>
          );
        })}
      </div>

      {/* ─── Time slots ──────────────────────────── */}
      <div className="mt-6">
        <SectionLabel icon={HiOutlineClock}>Available time slots</SectionLabel>
        {todaysSlots.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No slots available for this date.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {todaysSlots.map((item, index) => {
              const active = item.time === slotTime;
              return (
                <button
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                    active
                      ? 'bg-primary !text-white shadow-md shadow-primary/30'
                      : 'bg-gray-50 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-primary/50 hover:bg-white dark:hover:bg-gray-800'
                  }`}
                >
                  {item.time.toLowerCase()}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── CTA ───────────────────────────────── */}
      <div className="mt-7 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {slotTime
            ? <>Confirming your slot at <span className="font-semibold text-gray-900 dark:text-white">{slotTime.toLowerCase()}</span>.</>
            : 'Pick a date and time to continue.'}
        </p>
        <button
          onClick={onBook}
          disabled={!canBook}
          className={`inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
            !canBook
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-primary !text-white shadow-md shadow-primary/30 hover:bg-emerald-500 hover:shadow-lg hover:shadow-primary/40 active:scale-[0.98]'
          }`}
        >
          {isBooking ? (
            <>
              <LoadingSpinner size="w-4 h-4" />
              Booking…
            </>
          ) : (
            <>
              Book Appointment
              <HiOutlineArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default SlotPicker;
