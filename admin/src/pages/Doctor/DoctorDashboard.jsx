import React, { useEffect, useState, useMemo } from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import DefaultAvatar from '../../components/DefaultAvatar';

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, completeAppointment, cancelAppointment, getAppointments, appointments } =
    useContext(DoctorContext);
  const { slotDateFormat } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (dToken) {
      getDashData();
      getAppointments();
    }
  }, [dToken]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([getDashData(), getAppointments()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate counts for each tab using appointments data
  const tabCounts = useMemo(() => {
    if (!appointments || appointments.length === 0) {
      return {
        today: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return {
      today: appointments.filter(apt => {
        const appointmentDate = apt.slotDate.replace(/_/g, '-');
        return appointmentDate === today && !apt.cancelled && !apt.isCompleted;
      }).length,
      upcoming: appointments.filter(apt => {
        const appointmentDate = apt.slotDate.replace(/_/g, '-');
        return appointmentDate > today && !apt.cancelled && !apt.isCompleted;
      }).length,
      completed: appointments.filter(apt => apt.isCompleted).length,
      cancelled: appointments.filter(apt => apt.cancelled).length
    };
  }, [appointments]);

  // Filter appointments based on active tab
  const getFilteredAppointments = () => {
    if (!appointments || appointments.length === 0) return [];
    
    const today = new Date().toISOString().split('T')[0];
    
    return appointments.filter(appointment => {
      const appointmentDate = appointment.slotDate.replace(/_/g, '-');
      
      switch (activeTab) {
        case 'today':
          return appointmentDate === today;
        case 'upcoming':
          return appointmentDate > today;
        case 'completed':
          return appointment.isCompleted;
        case 'cancelled':
          return appointment.cancelled;
        default:
          return true;
      }
    });
  };

  const getStatusBadge = (appointment) => {
    if (appointment.cancelled) {
      return <span className="bg-red-900 text-red-200 text-xs px-2 py-1 rounded-full">Cancelled</span>;
    } else if (appointment.isCompleted) {
      return <span className="bg-green-900 text-green-200 text-xs px-2 py-1 rounded-full">Completed</span>;
    } else {
      return <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded-full">Scheduled</span>;
    }
  };

  return (
    dashData && (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-white">Doctor Dashboard</h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              title="Refresh dashboard"
            >
              {isRefreshing ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
          <p className="text-gray-400">Manage your appointments and patient care</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Earnings Card */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Earnings</p>
                <p className="text-2xl font-semibold text-white">₹{dashData.earnings || 0}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
            </div>
          </div>

          {/* Patients Card */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Patients</p>
                <p className="text-2xl font-semibold text-white">{dashData.patients || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Unique patients</p>
              </div>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Appointments</p>
                <p className="text-2xl font-semibold text-white">{dashData.appointments || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Total bookings</p>
              </div>
            </div>
          </div>

          {/* Today's Appointments Card */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-orange-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Today's Appointments</p>
                <p className="text-2xl font-semibold text-white">
                  {isRefreshing ? (
                    <div className="animate-pulse bg-gray-600 h-8 w-12 rounded"></div>
                  ) : (
                    tabCounts.today
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">Pending today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Patient Appointments</h2>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'today', label: 'Today', count: tabCounts.today },
                { id: 'upcoming', label: 'Upcoming', count: tabCounts.upcoming },
                { id: 'completed', label: 'Completed', count: tabCounts.completed },
                { id: 'cancelled', label: 'Cancelled', count: tabCounts.cancelled }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-700 text-gray-300 py-0.5 px-2.5 rounded-full text-xs">
                    {isRefreshing ? (
                      <div className="animate-pulse bg-gray-600 h-4 w-4 rounded"></div>
                    ) : (
                      tab.count
                    )}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Appointments List */}
          <div className="divide-y divide-gray-700">
            {isRefreshing ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center px-6 py-4">
                  <div className="animate-pulse bg-gray-600 w-12 h-12 rounded-full"></div>
                  <div className="flex-1 ml-4">
                    <div className="animate-pulse bg-gray-600 h-4 w-32 rounded mb-2"></div>
                    <div className="animate-pulse bg-gray-600 h-3 w-24 rounded mb-1"></div>
                    <div className="animate-pulse bg-gray-600 h-3 w-20 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="animate-pulse bg-gray-600 w-9 h-9 rounded-lg"></div>
                    <div className="animate-pulse bg-gray-600 w-9 h-9 rounded-lg"></div>
                  </div>
                </div>
              ))
            ) : getFilteredAppointments().length > 0 ? (
              getFilteredAppointments().map((item, index) => (
                <div
                  className="flex items-center px-6 py-4 hover:bg-gray-700 transition-colors duration-200"
                key={index}
              >
                  <div className="relative">
                    {item.userData?.image && item.userData.image !== '' ? (
                    <img
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                        src={item.userData.image}
                        alt={item.userData.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <DefaultAvatar 
                        name={item.userData?.name} 
                        size="w-12 h-12" 
                        className="border-2 border-gray-600"
                    />
                    )}
                    {item.cancelled && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        ✕
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 ml-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">
                        {item.userData?.name || 'Patient Name'}
                      </h3>
                      {getStatusBadge(item)}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {slotDateFormat(item.slotDate)} at {item.slotTime}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Patient ID: {item.userData?._id?.slice(-6) || 'N/A'}
                    </p>
                  </div>
                  
                  {!item.cancelled && !item.isCompleted && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => completeAppointment(item._id)}
                        className="bg-green-900 hover:bg-green-800 text-green-200 p-2 rounded-lg transition-colors duration-200"
                        title="Mark as Completed"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="bg-red-900 hover:bg-red-800 text-red-200 p-2 rounded-lg transition-colors duration-200"
                        title="Cancel Appointment"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                  </div>
                )}
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <div className="text-gray-500 mb-3">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">No appointments found</p>
                <p className="text-gray-500 text-sm">No appointments match the selected filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
