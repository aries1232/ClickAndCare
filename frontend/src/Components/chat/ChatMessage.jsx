import React from 'react';
import MessageStatus from '../MessageStatus.jsx';
import { formatTime } from '../../utils/dateUtils';

const ImageAttachment = ({ fileUrl, fileName }) => (
  <div className="max-w-full relative group message-image mb-2">
    <div className="relative overflow-hidden rounded-2xl shadow-lg border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm">
      <img
        src={fileUrl}
        alt={fileName || 'Image'}
        className="w-full h-auto cursor-pointer transition-all duration-300 group-hover:scale-[1.02] group-hover:brightness-110"
        onClick={() => window.open(fileUrl, '_blank')}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  </div>
);

const ChatMessage = ({ msg, isOwn }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} w-full`}>
    <div className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow-md ${
      isOwn
        ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-br-md'
        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
    }`}>
      {msg.message && <p className="text-sm lg:text-base select-none mb-2">{msg.message}</p>}
      {msg.messageType === 'image' && msg.fileUrl && <ImageAttachment fileUrl={msg.fileUrl} fileName={msg.fileName} />}
      <div className="text-xs text-right mt-1 opacity-60 flex items-center justify-end gap-1">
        <span>{formatTime(msg.createdAt)}</span>
        <MessageStatus status={msg.status} fromMe={isOwn} />
      </div>
    </div>
  </div>
);

export default ChatMessage;
