import React from 'react';

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const MyAppointmentsHeader = ({ counts = {}, filter, setFilter }) => (
  <div className="mb-8">
    <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
      Account
    </p>
    <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
      My Appointments
    </h1>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      Manage and track every consultation, payment, and chat — all in one place.
    </p>

    {setFilter && (
      <div className="mt-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-1">
        {TABS.map((t) => {
          const active = filter === t.value;
          const count = counts[t.value] ?? 0;
          return (
            <button
              key={t.value}
              onClick={() => setFilter(t.value)}
              className={`relative px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {t.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {count}
                </span>
              </span>
              {active && (
                <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    )}
  </div>
);

export default MyAppointmentsHeader;
