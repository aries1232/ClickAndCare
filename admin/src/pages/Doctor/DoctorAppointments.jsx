import React, { useContext, useEffect, useState, useCallback } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets.js";
import DefaultAvatar from '../../components/DefaultAvatar';
import ChatBox from '../../components/ChatBox.jsx';
import axios from "axios";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    profileData,
    backendUrl,
    unreadCounts,
    getUnreadCounts,
    incrementUnreadCount,
    resetUnreadCount,
    updateUnreadCount,
  } = useContext(DoctorContext);

  const { calculateAge, slotDateFormat, socket } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currency = "₹";
  const [chatOpen, setChatOpen] = useState(false);
  const [chatAppointment, setChatAppointment] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (dToken) {
      getAppointments();
      getUnreadCounts();
    }
  }, [dToken]);

  // Join socket rooms for all appointments when appointments are loaded
  useEffect(() => {
    if (appointments.length > 0 && socket) {
      appointments.forEach(appointment => {
        socket.emit('joinAppointmentRoom', appointment._id);
      });
    }
  }, [appointments, socket]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getAppointments();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredAppointments = appointments
    .filter((item) => {
      const matchesSearch = 
        item.userData.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === "all" || 
        (filterStatus === "cancelled" && item.cancelled) ||
        (filterStatus === "completed" && item.isCompleted) ||
        (filterStatus === "active" && !item.cancelled && !item.isCompleted);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by date (most recent first)
      try {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (a._id && b._id) {
          const timestampA = parseInt(a._id.substring(0, 8), 16) * 1000;
          const timestampB = parseInt(b._id.substring(0, 8), 16) * 1000;
          return timestampB - timestampA;
        }
        return 0;
      } catch (error) {
        return 0;
      }
    });

  const handleOpenChat = async (appointment) => {
    setChatAppointment(appointment);
    setChatMessages([]);
    setChatLoading(true);
    try {
      const url = `${backendUrl}/api/doctor/appointment/${appointment._id}/chat-messages`;
      const { data } = await axios.get(url, {
        headers: { dToken },
      });
      if (data.success) {
        setChatMessages(data.messages || []);
      } else {
        setChatMessages([]);
      }
    } catch (err) {
      console.error('Doctor: Error loading chat messages:', err);
      setChatMessages([]);
    }
    setChatOpen(true);
    setChatLoading(false);
  };

  const handleSendMessage = (msg) => {
    // The socket will handle broadcasting the message and updating the UI
    // No need to manually add to state here
  };

  // Note: Socket events are now handled globally by DoctorContext
  // No need to listen to socket events here as they're already handled in the context

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">My Appointments</h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            title="Refresh appointments"
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
        <p className="text-gray-400">Manage your patient appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Appointments</p>
              <p className="text-2xl font-semibold text-white">{appointments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Completed</p>
              <p className="text-2xl font-semibold text-white">{appointments.filter(item => item.isCompleted).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Active</p>
              <p className="text-2xl font-semibold text-white">{appointments.filter(item => !item.cancelled && !item.isCompleted).length}</p>
            </div>
          </div>
            </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-600 rounded-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Earnings</p>
              <p className="text-2xl font-semibold text-white">
                ₹{appointments.filter(item => item.isCompleted).reduce((sum, item) => sum + (item.amount || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Search Patients</label>
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Appointments</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Appointments List</h2>
            <span className="text-sm text-gray-400">({filteredAppointments.length} appointments)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAppointments.map((item, index) => (
                <tr key={index} className="hover:bg-gray-700/30 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{index + 1}</td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.userData.image && item.userData.image !== '' ? (
                      <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                          src={item.userData.image}
                        alt={item.userData.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <DefaultAvatar 
                          name={item.userData.name} 
                          size="w-10 h-10" 
                          className="border-2 border-gray-600"
                        />
                      )}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-white">{item.userData.name}</div>
                        <div className="text-sm text-gray-400">{item.userData.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {isNaN(new Date(item.userData.dob)) ? "N/A" : calculateAge(item.userData.dob)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{slotDateFormat(item.slotDate)}</div>
                    <div className="text-sm text-gray-400">{item.slotTime}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.payment 
                        ? 'bg-blue-900 text-blue-200' 
                        : 'bg-yellow-900 text-yellow-200'
                    }`}>
                      {item.payment ? 'ONLINE' : 'CASH'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                    ₹{item.amount}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.cancelled ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200">
                        Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
                        Active
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            {item.cancelled ? (
                      <span className="text-gray-500">No actions</span>
            ) : item.isCompleted ? (
                      <span className="text-green-400">✓ Completed</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => completeAppointment(item._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-green-600 text-green-400 rounded-md text-sm hover:bg-green-600 hover:text-white transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Complete
                        </button>
                        <button
                  onClick={() => cancelAppointment(item._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-400 rounded-md text-sm hover:bg-red-600 hover:text-white transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                        {item.payment && !item.isCompleted && !item.cancelled && (
                          <button
                            className="relative inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            onClick={() => handleOpenChat(item)}
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chat
                            {unreadCounts[item._id] > 0 && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                                {unreadCounts[item._id] > 99 ? '99+' : unreadCounts[item._id]}
                              </span>
                            )}
                          </button>
                        )}
              </div>
            )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-300">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <ChatBox
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        appointmentId={chatAppointment?._id}
        user={profileData}
        doctor={chatAppointment?.userData}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        loading={chatLoading}
        isDoctor={true}
      />
    </div>
  );
};

export default DoctorAppointments;
