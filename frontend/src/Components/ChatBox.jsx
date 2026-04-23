import React from 'react';
import { useSocketContext } from '../context/SocketContext.jsx';
import { useChatSocket } from '../hooks/useChatSocket';
import { useChatImageUpload } from '../hooks/useChatImageUpload';
import ChatHeader from './chat/ChatHeader.jsx';
import MessageList from './chat/MessageList.jsx';
import ChatComposer from './chat/ChatComposer.jsx';
import ScrollToBottomButton from './chat/ScrollToBottomButton.jsx';

const ChatBox = ({ isOpen, onClose, appointmentId, user, doctor, messages, loading }) => {
  const { socket } = useSocketContext();

  const chat = useChatSocket({ isOpen, appointmentId, socket, user, initialMessages: messages });
  const upload = useChatImageUpload({
    onUploaded: ({ fileUrl, fileName, fileSize }) => chat.sendImage({ fileUrl, fileName, fileSize }),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-gradient-to-br from-blue-50/80 via-white/90 to-purple-100/80 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl w-full max-w-md flex flex-col h-[80vh] min-h-[400px] relative border border-white/30 backdrop-blur-lg">
        {chat.showScrollButton && <ScrollToBottomButton onClick={chat.scrollToBottom} />}

        <ChatHeader user={user} doctor={doctor} onClose={onClose} />

        <MessageList
          ref={chat.messagesContainerRef}
          messages={chat.liveMessages}
          loading={loading}
          isOwn={chat.isOwn}
          endRef={chat.messagesEndRef}
        />

        <ChatComposer
          uploading={upload.uploading}
          fileInputRef={upload.fileInputRef}
          onFileSelect={upload.handleFileSelect}
          onOpenPicker={upload.openPicker}
          onSendText={chat.sendText}
        />
      </div>
    </div>
  );
};

export default ChatBox;
