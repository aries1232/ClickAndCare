import React, { useState, useEffect } from 'react';

const RealTimeIndicator = ({ isRefreshing = false, lastUpdated = null }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <div className="flex items-center gap-1">
        {isRefreshing ? (
          <>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Updating...</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live</span>
          </>
        )}
      </div>
      {lastUpdated && (
        <span className="text-gray-500">
          • Last updated: {formatTime(lastUpdated)}
        </span>
      )}
    </div>
  );
};

export default RealTimeIndicator; 