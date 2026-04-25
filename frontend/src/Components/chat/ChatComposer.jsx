import React, { useState } from 'react';
import { HiOutlinePhotograph, HiOutlinePaperAirplane } from 'react-icons/hi';

const ChatComposer = ({ uploading, fileInputRef, onFileSelect, onOpenPicker, onSendText }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendText(input);
    setInput('');
  };

  const canSend = input.trim().length > 0;

  return (
    <form
      className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        onClick={onOpenPicker}
        disabled={uploading}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-primary hover:bg-gray-100 dark:text-gray-400 dark:hover:text-primary dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Attach image"
      >
        {uploading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-primary" />
        ) : (
          <HiOutlinePhotograph className="w-5 h-5" />
        )}
      </button>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileSelect} />

      <input
        type="text"
        className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 text-sm transition-colors"
        placeholder="Type a message…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        type="submit"
        disabled={!canSend}
        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
          canSend
            ? 'bg-primary !text-white shadow-md shadow-primary/30 hover:bg-emerald-500 active:scale-95'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Send message"
      >
        <HiOutlinePaperAirplane className="w-5 h-5 -rotate-45" />
      </button>
    </form>
  );
};

export default ChatComposer;
