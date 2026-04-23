import React, { useState } from 'react';
import { FaImage } from 'react-icons/fa';

const ChatComposer = ({ uploading, fileInputRef, onFileSelect, onOpenPicker, onSendText }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendText(input);
    setInput('');
  };

  return (
    <form
      className="flex items-center gap-2 p-4 border-t border-white/20 bg-white/30 dark:bg-gray-900/60 rounded-b-2xl backdrop-blur-md"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        onClick={onOpenPicker}
        disabled={uploading}
        className="px-3 py-2 bg-gray-200/80 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl text-gray-700 dark:text-white hover:bg-gray-300/80 dark:hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 dark:border-white"></div> : <FaImage className="text-base lg:text-lg" />}
      </button>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileSelect} />

      <input
        type="text"
        className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
      >
        Send
      </button>
    </form>
  );
};

export default ChatComposer;
