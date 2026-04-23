import React from 'react';
import DefaultAvatar from './DefaultAvatar.jsx';

const ProfileImage = ({ user, size = 'w-10 h-10' }) => {
  if (user?.image && user.image !== '') {
    return (
      <img
        className={`${size} rounded-full object-cover border-2 border-gray-200`}
        src={user.image}
        alt="Profile"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  }
  return <DefaultAvatar name={user?.name} size={size} />;
};

export default ProfileImage;
