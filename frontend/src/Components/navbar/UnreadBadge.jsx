import React from 'react';

const UnreadBadge = ({ count }) => {
  if (!count || count <= 0) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default UnreadBadge;
