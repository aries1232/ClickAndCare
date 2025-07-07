import React from 'react';

const DefaultAvatar = ({ name, size = 'w-10 h-10', className = '' }) => {
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(name);

  return (
    <div 
      className={`${size} ${className} bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm`}
      style={{ 
        backgroundColor: '#17de71',
        minWidth: size.includes('w-') ? size : '40px',
        minHeight: size.includes('h-') ? size : '40px'
      }}
    >
      {initials}
    </div>
  );
};

export default DefaultAvatar; 