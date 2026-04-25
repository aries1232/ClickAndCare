import React from 'react';
import MessageSkeleton from '../MessageSkeleton';
import ChatMessage from './ChatMessage.jsx';
import { formatDate, isDifferentDay } from '../../utils/dateUtils';

const DateSeparator = ({ dateStr }) => (
  <div className="flex justify-center my-4">
    <div className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[11px] font-medium px-3 py-1 rounded-full ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm">
      {formatDate(dateStr)}
    </div>
  </div>
);

const LoadOlderButton = ({ loadingOlder, onLoadOlder }) => (
  <div className="flex justify-center py-2">
    <button
      type="button"
      onClick={onLoadOlder}
      disabled={loadingOlder}
      className="text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-1.5 rounded-full ring-1 ring-gray-200 dark:ring-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loadingOlder ? 'Loading…' : 'Load earlier messages'}
    </button>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6">
    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.3-3.9C3.47 14.93 3 13.51 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </div>
    <p className="font-semibold text-gray-700 dark:text-gray-200">No messages yet</p>
    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Send a message to start the conversation.</p>
  </div>
);

const MessageList = React.forwardRef(({ messages, loading, isOwn, endRef, hasMoreOlder, loadingOlder, onLoadOlder }, containerRef) => (
  <div
    ref={containerRef}
    className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-1 bg-gray-50 dark:bg-gray-900/50"
  >
    {hasMoreOlder && onLoadOlder && <LoadOlderButton loadingOlder={loadingOlder} onLoadOlder={onLoadOlder} />}

    {loading ? (
      <>
        <MessageSkeleton />
        <MessageSkeleton />
        <MessageSkeleton />
      </>
    ) : messages.length > 0 ? (
      messages.map((msg, idx) => {
        const showDateSeparator = idx === 0 || isDifferentDay(msg.createdAt, messages[idx - 1]?.createdAt);
        return (
          <React.Fragment key={msg._id || idx}>
            {showDateSeparator && <DateSeparator dateStr={msg.createdAt} />}
            <ChatMessage msg={msg} isOwn={isOwn(msg)} />
          </React.Fragment>
        );
      })
    ) : (
      <EmptyState />
    )}
    <div ref={endRef} />
  </div>
));

export default MessageList;
