import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineArrowRight, HiOutlineFilter } from 'react-icons/hi';

const FILTER_LABEL = {
  all: 'any',
  active: 'upcoming',
  completed: 'completed',
  cancelled: 'cancelled',
};

const EmptyAppointments = ({ hasNone = true, filter = 'all' }) => {
  if (hasNone) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 sm:p-14 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <HiOutlineCalendar className="w-7 h-7" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
          No appointments yet
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
          Browse our verified specialists and book your first consultation in under a minute.
        </p>
        <Link
          to="/doctors"
          onClick={() => window.scrollTo(0, 0)}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary !text-white font-semibold text-sm shadow-md shadow-primary/30 hover:bg-emerald-500 hover:shadow-lg hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200"
        >
          Browse Doctors
          <HiOutlineArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <HiOutlineFilter className="w-6 h-6" />
      </div>
      <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
        No {FILTER_LABEL[filter] || ''} appointments
      </h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Try a different tab to see other appointments.
      </p>
    </div>
  );
};

export default EmptyAppointments;
