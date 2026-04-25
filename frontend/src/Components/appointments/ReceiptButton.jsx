import React from 'react';
import { useReceiptDownload } from '../../hooks/useReceiptDownload';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
  </svg>
);

const ReceiptButton = ({ appointmentId }) => {
  const { state, start, download } = useReceiptDownload(appointmentId);

  const handleClick = () => {
    if (state === 'ready') return download();
    return start();
  };

  let label;
  let icon = null;
  let cls =
    'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded transition-all duration-200 sm:min-w-48';
  if (state === 'idle') {
    label = 'Download Receipt';
    icon = <DownloadIcon />;
    cls += ' border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700';
  } else if (state === 'loading') {
    label = 'Generating…';
    icon = <Spinner />;
    cls += ' border border-gray-300 text-gray-500 cursor-wait dark:border-gray-600 dark:text-gray-400';
  } else if (state === 'ready') {
    label = 'Download Receipt';
    icon = <DownloadIcon />;
    cls += ' border border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20';
  } else {
    label = 'Retry';
    icon = <DownloadIcon />;
    cls += ' border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20';
  }

  return (
    <button onClick={handleClick} className={cls} disabled={state === 'loading'}>
      {icon}
      {label}
    </button>
  );
};

export default ReceiptButton;
