import React from 'react';
import {
  HiOutlineBadgeCheck,
  HiOutlineAcademicCap,
  HiOutlineSparkles,
  HiOutlineCash,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineUsers,
} from 'react-icons/hi';

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700">
    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{value}</p>
    </div>
  </div>
);

const DoctorHeader = ({ docInfo }) => {
  const available = docInfo?.available;

  return (
    <section className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 mt-4">
      {/* ─── Doctor photo ─────────────────────────── */}
      <div className="relative">
        <div className="aspect-[4/5] w-full max-w-xs mx-auto md:mx-0 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-emerald-200/30 dark:from-primary/10 dark:to-emerald-900/20 ring-1 ring-gray-200 dark:ring-gray-700">
          <img
            src={docInfo.image}
            alt={docInfo.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ring-1 ${
          available
            ? 'bg-white/90 text-emerald-700 ring-emerald-200'
            : 'bg-white/90 text-gray-600 ring-gray-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          {available ? 'Available today' : 'Currently unavailable'}
        </div>
      </div>

      {/* ─── Doctor info ──────────────────────────── */}
      <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-gray-800/60 ring-1 ring-gray-200 dark:ring-gray-700">
        <div className="flex items-start gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {docInfo.name}
          </h1>
          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
            <HiOutlineBadgeCheck className="w-4 h-4" />
            Verified
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="inline-flex items-center gap-1.5">
            <HiOutlineAcademicCap className="w-4 h-4 text-primary" />
            {docInfo.degree}
          </span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className="inline-flex items-center gap-1.5">
            <HiOutlineSparkles className="w-4 h-4 text-primary" />
            {docInfo.speciality}
          </span>
          <span className="ml-1 inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            {docInfo.experience} experience
          </span>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Stat icon={HiOutlineStar} label="Rating" value="4.9 / 5" />
          <Stat icon={HiOutlineUsers} label="Patients" value="500+" />
          <Stat icon={HiOutlineClock} label="Response" value="~2 hours" />
        </div>

        {/* About */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
            About
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
            {docInfo.about}
          </p>
        </div>

        {/* Fees */}
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <HiOutlineCash className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase">
                Consultation fee
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{docInfo.fees}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
            One-time, secure payment
          </p>
        </div>
      </div>
    </section>
  );
};

export default DoctorHeader;
