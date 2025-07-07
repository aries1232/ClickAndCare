import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";

const ScheduleManagement = () => {
  const { dToken, profileData, getProfileData } = useContext(DoctorContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState({
    monday: { start: "09:00", end: "17:00", available: true },
    tuesday: { start: "09:00", end: "17:00", available: true },
    wednesday: { start: "09:00", end: "17:00", available: true },
    thursday: { start: "09:00", end: "17:00", available: true },
    friday: { start: "09:00", end: "17:00", available: true },
    saturday: { start: "09:00", end: "13:00", available: true },
    sunday: { start: "09:00", end: "17:00", available: false }
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const handleScheduleChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleSaveSchedule = async () => {
    try {
      // Here you would typically save to backend
      console.log('Saving schedule:', schedule);
      setIsEditing(false);
      // Add toast notification for success
    } catch (error) {
      console.error('Error saving schedule:', error);
      // Add toast notification for error
    }
  };

  const getCurrentWeekDates = () => {
    const dates = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Schedule Management</h1>
        <p className="text-gray-400">Manage your availability and working hours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Schedule */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Weekly Schedule</h2>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {isEditing ? 'Cancel' : 'Edit Schedule'}
              </button>
            </div>
          </div>

          <div className="p-6">
            {daysOfWeek.map((day) => (
              <div key={day.key} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={schedule[day.key].available}
                    onChange={(e) => handleScheduleChange(day.key, 'available', e.target.checked)}
                    disabled={!isEditing}
                    className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-700"
                  />
                  <span className="font-medium text-white min-w-20">{day.label}</span>
                </div>
                
                {schedule[day.key].available ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={schedule[day.key].start}
                      onChange={(e) => handleScheduleChange(day.key, 'start', e.target.value)}
                      disabled={!isEditing}
                      className="px-2 py-1 border border-gray-600 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="time"
                      value={schedule[day.key].end}
                      onChange={(e) => handleScheduleChange(day.key, 'end', e.target.value)}
                      disabled={!isEditing}
                      className="px-2 py-1 border border-gray-600 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
                    />
                  </div>
                ) : (
                  <span className="text-red-400 text-sm font-medium">Not Available</span>
                )}
              </div>
            ))}

            {isEditing && (
              <div className="mt-6 pt-4 border-t border-gray-700">
                <button
                  onClick={handleSaveSchedule}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Save Schedule
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">This Week</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-7 gap-2">
              {getCurrentWeekDates().map((date, index) => {
                const dayKey = daysOfWeek[index].key;
                const daySchedule = schedule[dayKey];
                
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 text-center ${
                      isToday(date)
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-xs font-medium text-gray-400 mb-1">
                      {formatDate(date)}
                    </div>
                    <div className="text-lg font-bold text-white mb-2">
                      {date.getDate()}
                    </div>
                    {daySchedule.available ? (
                      <div className="text-xs text-green-400 font-medium">
                        {daySchedule.start} - {daySchedule.end}
                      </div>
                    ) : (
                      <div className="text-xs text-red-400 font-medium">
                        Not Available
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Working Days</p>
              <p className="text-2xl font-bold text-white">
                {Object.values(schedule).filter(day => day.available).length}
              </p>
            </div>
            <div className="bg-blue-600 p-3 rounded-full">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Average Hours/Day</p>
              <p className="text-2xl font-bold text-white">
                {(() => {
                  const workingDays = Object.values(schedule).filter(day => day.available);
                  if (workingDays.length === 0) return 0;
                  
                  const totalHours = workingDays.reduce((total, day) => {
                    const start = new Date(`2000-01-01T${day.start}`);
                    const end = new Date(`2000-01-01T${day.end}`);
                    return total + (end - start) / (1000 * 60 * 60);
                  }, 0);
                  
                  return Math.round(totalHours / workingDays.length);
                })()}
              </p>
            </div>
            <div className="bg-green-600 p-3 rounded-full">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Next Available</p>
              <p className="text-lg font-bold text-white">
                {(() => {
                  const today = new Date();
                  const todayDay = today.getDay();
                  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                  
                  for (let i = 1; i <= 7; i++) {
                    const checkDay = (todayDay + i) % 7;
                    const dayKey = daysOfWeek[checkDay];
                    if (schedule[dayKey].available) {
                      const nextDate = new Date(today);
                      nextDate.setDate(today.getDate() + i);
                      return nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    }
                  }
                  return 'No availability';
                })()}
              </p>
            </div>
            <div className="bg-orange-600 p-3 rounded-full">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement; 