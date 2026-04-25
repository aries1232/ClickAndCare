import React from 'react';
import { useSocketContext } from '../context/SocketContext.jsx';
import { useChatSocket } from '../hooks/useChatSocket';
import { useChatImageUpload } from '../hooks/useChatImageUpload';
import ChatHeader from './chat/ChatHeader.jsx';
import MessageList from './chat/MessageList.jsx';
import ChatComposer from './chat/ChatComposer.jsx';
import ScrollToBottomButton from './chat/ScrollToBottomButton.jsx';

const ChatBox = ({ isOpen, onClose, appointmentId, user, doctor, messages, loading, hasMoreOlder, loadingOlder, onLoadOlder }) => {
  const { socket } = useSocketContext();

  const chat = useChatSocket({ isOpen, appointmentId, socket, user, initialMessages: messages });
  const upload = useChatImageUpload({
    onUploaded: ({ fileUrl, fileName, fileSize }) => chat.sendImage({ fileUrl, fileName, fileSize }),
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 inset-0 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[380px] sm:h-[600px] sm:max-h-[calc(100vh-2rem)] flex flex-col bg-white dark:bg-gray-800 sm:rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden animate-chatbox-slide-in"
      role="dialog"
      aria-label="Appointment chat"
    >
      {chat.showScrollButton && <ScrollToBottomButton onClick={chat.scrollToBottom} />}

      <ChatHeader user={user} doctor={doctor} onClose={onClose} />

      <MessageList
        ref={chat.messagesContainerRef}
        messages={chat.liveMessages}
        loading={loading}
        isOwn={chat.isOwn}
        endRef={chat.messagesEndRef}
        hasMoreOlder={hasMoreOlder}
        loadingOlder={loadingOlder}
        onLoadOlder={onLoadOlder}
      />

      <ChatComposer
        uploading={upload.uploading}
        fileInputRef={upload.fileInputRef}
        onFileSelect={upload.handleFileSelect}
        onOpenPicker={upload.openPicker}
        onSendText={chat.sendText}
      />
    </div>
  );
};

export default ChatBox;
