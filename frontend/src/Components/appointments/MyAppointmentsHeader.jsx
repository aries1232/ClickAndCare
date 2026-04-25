import React from 'react';

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const MyAppointmentsHeader = ({ counts = {}, filter, setFilter }) => (
  <div className="mb-6 sm:mb-8">
    <p className="inline-block text-xs font-semibold tracking-[0.18em] text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
      Account
    </p>
    <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
      My Appointments
    </h1>
    <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
      Manage and track every consultation, payment, and chat.
    </p>

    {setFilter && (
      <>
        {/* ─── Mobile: chip-style scrolling filter bar ─── */}
        <div className="sm:hidden -mx-4 px-4 mt-5">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide" role="tablist">
            {TABS.map((t) => {
              const active = filter === t.value;
              const count = counts[t.value] ?? 0;
              return (
                <button
                  key={t.value}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(t.value)}
                  className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'bg-primary !text-white shadow-md shadow-primary/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 ring-1 ring-gray-200 dark:ring-gray-700'
                  }`}
                >
                  {t.label}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      active
                        ? 'bg-white/25 text-white'
                        : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Desktop: underlined tabs ─── */}
        <div className="hidden sm:flex flex-wrap gap-2 mt-6 border-b border-gray-200 dark:border-gray-700 pb-1">
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
      </>
    )}
  </div>
);

export default MyAppointmentsHeader;
