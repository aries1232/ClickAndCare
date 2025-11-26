import React, { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useSocketContext } from "../context/SocketContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import ChatBox from '../Components/ChatBox.jsx';

const MyAppointment = () => {
  const { token, backendUrl, getDoctors, userData } = useContext(AppContext);
  const { socket } = useSocketContext();
  const [appointments, setAppointments] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatAppointment, setChatAppointment] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (dateFormat) => {
    const dateArray = dateFormat.split("_");
    return (
      " " +
      dateArray[0] +
      " " +
      months[parseInt(dateArray[1]) - 1] +
      " " +
      dateArray[2]
    );
  };

  const handlePaynow = async (appointmentId) => {
    console.log('Stripe Key:', import.meta.env.VITE_STRIPE_KEY_ID);
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY_ID);

    try {
      const response = await axios.post(
        backendUrl + "/api/user/make-payment",
        { appointmentId },
        { headers: { token } }
      );

      if (response.data.success) {
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Payment initiation failed.");
    }
  };

  const getMyAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        // Sort appointments by date in descending order (most recent first)
        const sortedAppointments = data.data.sort((a, b) => b.date - a.date);
        setAppointments(sortedAppointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUnreadCounts = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/unread-counts", {
        headers: { token },
      });
      if (data.success) {
        // console.log('User: Fetched unread counts:', data.unreadCounts);
        setUnreadCounts(data.unreadCounts);
      }
    } catch (error) {
      // console.error('Error fetching unread counts:', error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getMyAppointments();
        getDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleOpenChat = async (appointment) => {
    setChatAppointment(appointment);
    setChatMessages([]);
    setChatLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointment/${appointment._id}/chat-messages`, {
        headers: { token },
      });
      if (data.success) {
        setChatMessages(data.messages || []);
      } else {
        setChatMessages([]);
      }
    } catch (err) {
      // console.error('User: Error loading chat messages:', err);
      setChatMessages([]);
    }
    setChatOpen(true);
    setChatLoading(false);
  };

  const handleSendMessage = (msg) => {
    // The socket will handle broadcasting the message and updating the UI
    // No need to manually add to state here
  };

  useEffect(() => {
    if (token) {
      getMyAppointments();
      getUnreadCounts();
    }
  }, [token]);

  // Join socket rooms for all appointments when appointments are loaded
  useEffect(() => {
    if (appointments.length > 0 && socket) {
      // console.log('User: Joining socket rooms for appointments:', appointments.map(a => a._id));
      appointments.forEach(appointment => {
        socket.emit('joinAppointmentRoom', appointment._id);
      });
    }
  }, [appointments, socket]);

  // Handle new messages for unread count updates
  const handleNewMessage = useCallback((event) => {
    const { appointmentId, message } = event.detail;
    const currentUserId = userData?._id || userData?.id;

    // Check if this is the user's own message (sent within last 5 seconds)
    const isOwnRecentMessage = message.createdAt &&
      (new Date() - new Date(message.createdAt)) < 5000 &&
      message.sender && currentUserId &&
      message.sender.toString() === currentUserId.toString();

    // Only increment unread count if message is from the other person
    // Convert both to strings for reliable comparison
    if (message.sender && currentUserId &&
      message.sender.toString() !== currentUserId.toString() &&
      !isOwnRecentMessage) {
      // console.log('User: Incrementing unread count for appointment:', appointmentId);
      setUnreadCounts(prev => {
        const currentCount = prev[appointmentId] || 0;
        const updated = {
          ...prev,
          [appointmentId]: currentCount + 1
        };
        return updated;
      });
    }
  }, [userData?._id, userData?.id, userData]);

  // Note: Socket events are now handled globally by SocketContext.jsx
  // No need to listen to socket events here as they're already dispatched as custom events

  // Listen for all custom events (consolidated to prevent duplicate listeners)
  useEffect(() => {
    // Don't add event listeners if userData is not loaded
    if (!userData) {
      return;
    }

    const handleResetUnreadCount = (event) => {
      const { appointmentId } = event.detail;
      setUnreadCounts(prev => ({
        ...prev,
        [appointmentId]: 0
      }));
    };

    const handleUnreadCountUpdate = (event) => {
      const { appointmentId, unreadCounts: newUnreadCounts } = event.detail;
      const currentUserId = userData?._id || userData?.id;

      if (newUnreadCounts && newUnreadCounts[currentUserId] !== undefined) {
        setUnreadCounts(prev => ({
          ...prev,
          [appointmentId]: newUnreadCounts[currentUserId]
        }));
      }
    };

    // Add all event listeners in one place
    window.addEventListener('newMessage', handleNewMessage);
    window.addEventListener('resetUnreadCount', handleResetUnreadCount);
    window.addEventListener('unreadCountUpdate', handleUnreadCountUpdate);

    return () => {
      // Clean up all event listeners
      window.removeEventListener('newMessage', handleNewMessage);
      window.removeEventListener('resetUnreadCount', handleResetUnreadCount);
      window.removeEventListener('unreadCountUpdate', handleUnreadCountUpdate);
    };
  }, [handleNewMessage, userData]);

  const getStatusBadge = (appointment) => {
    if (appointment.cancelled) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    } else if (appointment.isCompleted) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completed
        </span>
      );
    } else if (appointment.payment) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Confirmed
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending Payment
        </span>
      );
    }
  };

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Appointments</h1>
        {/* Info Notice: Chat visibility */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-300">Manage and track your scheduled appointments</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg shadow-sm">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
              <span className="text-sm">Chat with doctor will be available only after payment is completed for the appointment.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Doctor Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img
                        className="w-full h-full object-cover"
                        src={item.docData.image}
                        alt={item.docData.name}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDMTE2LjU2OSA3MCAxMzAgODMuNDMxIDMwIDEwMEMxMzAgMTE2LjU2OSAxMTYuNTY5IDEzMCAxMDAgMTMwQzgzLjQzMSAxMzAgNzAgMTE2LjU2OSA3MCAxMEM3MCA4My40MzEgODMuNDMxIDcwIDEwMCA3MFoiIGZpbGw9IiNEMzQ1NEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTMwQzExNi41NjkgMTMwIDEzMCAxNDMuNDMxIDEzMCAxNjBDMTMwIDE3Ni41NjkgMTE2LjU2OSAxOTAgMTAwIDE5MEM4My40MzEgMTkwIDcwIDE3Ni41NjkgNzAgMTYwQzcwIDE0My40MzEgODMuNDMxIDEzMCAxMDAgMTMwWiIgZmlsbD0iI0QzNDU0RjYiLz4KPC9zdmc+';
                        }}
                      />
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                          {item.docData.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">{item.docData.speciality}</p>
                      </div>
                      {getStatusBadge(item)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {slotDateFormat(item.slotDate)} | {item.slotTime}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Consultation Fee</p>
                        <p className="font-medium text-primary">₹{item.amount}</p>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Address</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.docData.address?.address || 'Address not available'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    {!item.payment && !item.cancelled && !item.isCompleted && (
                      <>
                        <button
                          onClick={() => handlePaynow(item._id)}
                          className="text-sm text-stone-400 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                        >
                          Pay Now
                        </button>

                        <AppointmentTimer
                          appointmentDate={item.date}
                          onExpire={() => {
                            // Refresh appointments when timer expires to remove the item
                            getMyAppointments();
                          }}
                        />

                        <div className="flex items-center gap-2">
                          <button
                            className="text-sm text-stone-400 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                            onClick={() => cancelAppointment(item._id)}
                          >
                            Cancel Appointment
                          </button>
                        </div>
                      </>
                    )}

                    {item.payment && !item.isCompleted && !item.cancelled && (
                      <>
                        <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                          Payment Done !
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            className="relative inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl sm:min-w-48"
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
                        </div>
                      </>
                    )}

                    {item.isCompleted && (
                      <button className="sm:min-w-48 py-2 border border-gray-400 rounded text-gray-500">
                        Appointment Completed
                      </button>
                    )}

                    {item.cancelled && (
                      <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                        Appointment Cancelled
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Appointments Found</h3>
            <p className="text-gray-600 dark:text-gray-300">You haven't booked any appointments yet.</p>
          </div>
        )}
      </div>
      <ChatBox
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        appointmentId={chatAppointment?._id}
        user={userData}
        doctor={chatAppointment?.docData}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        loading={chatLoading}
        socket={socket}
      />
    </div>
  );
};

// Helper component for the timer
const AppointmentTimer = ({ appointmentDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdTime = new Date(appointmentDate).getTime();
      const expireTime = createdTime + 2 * 60 * 1000; // 2 minutes
      const now = new Date().getTime();
      const difference = expireTime - now;

      if (difference <= 0) {
        onExpire();
        return 0;
      }
      return difference;
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [appointmentDate, onExpire]);

  if (timeLeft === null) return null;
  if (timeLeft <= 0) return <span className="text-red-500 font-bold">Expired</span>;

  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="mt-2">
      <p className="text-red-500 text-sm font-medium animate-pulse">
        Complete payment in: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
      <p className="text-xs text-red-400 mt-1">
        Appointment will be cancelled automatically if not paid.
      </p>
    </div>
  );
};

export default MyAppointment;
