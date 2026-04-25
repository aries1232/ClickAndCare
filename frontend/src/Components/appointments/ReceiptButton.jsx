import React from 'react';
import { HiOutlineDownload, HiOutlineRefresh, HiOutlineDocumentText } from 'react-icons/hi';
import { useReceiptDownload } from '../../hooks/useReceiptDownload';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const baseClass =
  'inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200';

const ReceiptButton = ({ appointmentId }) => {
  const { state, start, download } = useReceiptDownload(appointmentId);

  const handleClick = () => {
    if (state === 'ready') return download();
    return start();
  };

  let label;
  let Icon = HiOutlineDocumentText;
  let cls = baseClass;

  if (state === 'idle') {
    label = 'Download Receipt';
    Icon = HiOutlineDocumentText;
    cls += ' ring-1 ring-gray-300 dark:ring-gray-600 text-gray-700 dark:text-gray-200 hover:ring-primary/50 hover:text-primary dark:hover:text-primary hover:bg-primary/5';
  } else if (state === 'loading') {
    label = 'Generating receipt…';
    cls += ' ring-1 ring-gray-300 dark:ring-gray-600 text-gray-500 dark:text-gray-400 cursor-wait';
  } else if (state === 'ready') {
    label = 'Download Receipt';
    Icon = HiOutlineDownload;
    cls += ' bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-300 dark:ring-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20';
  } else {
    label = 'Retry receipt';
    Icon = HiOutlineRefresh;
    cls += ' bg-red-50 dark:bg-red-500/10 ring-1 ring-red-300 dark:ring-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20';
  }

  return (
    <button onClick={handleClick} className={cls} disabled={state === 'loading'} type="button">
      {state === 'loading' ? <Spinner /> : <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
};

export default ReceiptButton;
