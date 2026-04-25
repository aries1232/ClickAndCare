import React from 'react';
import MessageStatus from '../MessageStatus.jsx';
import { formatTime } from '../../utils/dateUtils';

const ImageAttachment = ({ fileUrl, fileName, isOwn }) => (
  <div className="mb-1.5 -mx-1 -mt-1">
    <img
      src={fileUrl}
      alt={fileName || ''}
      className={`max-w-full h-auto cursor-pointer rounded-xl ring-1 ${
        isOwn ? 'ring-emerald-700/30' : 'ring-gray-200 dark:ring-gray-600'
      } hover:opacity-95 transition-opacity duration-200`}
      onClick={() => window.open(fileUrl, '_blank')}
    />
  </div>
);

const ChatMessage = ({ msg, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} w-full py-0.5`}>
    <div
      className={`px-3.5 py-2 max-w-[75%] break-words ${
        isOwn
          ? 'bg-primary !text-white rounded-2xl rounded-br-sm shadow-sm'
          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-sm ring-1 ring-gray-200 dark:ring-gray-600 shadow-sm'
      }`}
    >
      {msg.messageType === 'image' && msg.fileUrl && (
        <ImageAttachment fileUrl={msg.fileUrl} fileName={msg.fileName} isOwn={isOwn} />
      )}
      {msg.message && (
        <p className={`text-sm leading-snug ${isOwn ? '!text-white' : ''}`}>{msg.message}</p>
      )}
      <div
        className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
          isOwn ? 'text-white/75' : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        <span>{formatTime(msg.createdAt)}</span>
        <MessageStatus status={msg.status} fromMe={isOwn} />
      </div>
    </div>
  </div>
);

export default ChatMessage;
