import React from 'react';
import { useNavigate } from 'react-router-dom';

const ACCENT = {
  blue: 'text-blue-400 hover:text-blue-300',
  green: 'text-green-400 hover:text-green-300',
  purple: 'text-purple-400 hover:text-purple-300',
};

const AuthLinks = ({ links, accent = 'blue' }) => {
  const navigate = useNavigate();
  const color = ACCENT[accent] || ACCENT.blue;

  return (
    <div className="text-center space-y-2">
      {links.map((link, i) => (
        <p key={i} className="text-sm text-gray-400">
          {link.prefix ? `${link.prefix} ` : ''}
          <span
            onClick={() => navigate(link.to)}
            className={`${link.muted ? 'text-gray-500 hover:text-gray-300' : `${color} font-medium`} cursor-pointer transition-colors`}
          >
            {link.label}
          </span>
        </p>
      ))}
    </div>
  );
};

export default AuthLinks;
