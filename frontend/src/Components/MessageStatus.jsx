import React from 'react';

const SingleTick = ({ className = 'text-white' }) => (
  <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const DoubleTick = ({ className }) => (
  <div className="flex items-center">
    <SingleTick className={className} />
    <SingleTick className={`${className} -ml-1`} />
  </div>
);

const MessageStatus = ({ status, fromMe }) => {
  if (!fromMe) return null;

  let icon;
  if (status === 'sent') icon = <SingleTick />;
  else if (status === 'delivered') icon = <DoubleTick className="text-white" />;
  else if (status === 'read') icon = <DoubleTick className="text-blue-400 drop-shadow-sm" />;
  else return null;

  return <div className="flex items-center gap-1 ml-2">{icon}</div>;
};

export default MessageStatus;
