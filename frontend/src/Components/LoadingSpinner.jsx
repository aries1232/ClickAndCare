import React from 'react'

const LoadingSpinner = ({ size = "w-6 h-6", color = "text-white" }) => {
  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${size} ${color}`}>
    </div>
  )
}

export default LoadingSpinner 