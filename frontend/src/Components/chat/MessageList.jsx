import React from 'react';
import MessageSkeleton from '../MessageSkeleton';
import ChatMessage from './ChatMessage.jsx';
import { formatDate, isDifferentDay } from '../../utils/dateUtils';

const DateSeparator = ({ dateStr }) => (
  <div className="flex justify-center my-4">
    <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
      {formatDate(dateStr)}
    </div>
  </div>
);

const MessageList = React.forwardRef(({ messages, loading, isOwn, endRef }, containerRef) => (
  <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2 bg-transparent">
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
      <div className="text-center text-gray-400">No messages yet. Start the conversation!</div>
    )}
    <div ref={endRef} />
  </div>
));

export default MessageList;
