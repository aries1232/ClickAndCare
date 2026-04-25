import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { AppContext } from "./AppContext.jsx";
import { DoctorContext } from "./DoctorContext.jsx";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userData } = useContext(AppContext) || {};
  const { profileData } = useContext(DoctorContext) || {};

  // The connected actor — user or doctor. We only depend on the *_id* below
  // (a stable string) so periodic profile refetches don't tear down and
  // recreate the socket. Earlier this churned every PROFILE_REFRESH_MS,
  // dropping inbound messages during the reconnect window.
  const currentUserId = useMemo(() => {
    return userData?._id || profileData?._id || null;
  }, [userData?._id, profileData?._id]);

  useEffect(() => {
    if (!currentUserId) {
      setOnlineUsers([]);
      return undefined;
    }

    // Dev: Vite proxies /socket.io to local backend. Prod: separate always-on host.
    const socketUrl = import.meta.env.DEV ? '/' : (import.meta.env.VITE_SOCKET_URL || '/');
    const newSocket = io(socketUrl, {
      path: '/socket.io',
      query: { userId: currentUserId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      setOnlineUsers((prev) => (prev.includes(currentUserId) ? prev : [...prev, currentUserId]));
    });
    newSocket.on('disconnect', () => {
      setOnlineUsers((prev) => prev.filter((id) => id !== currentUserId));
    });
    newSocket.on('getOnlineUsers', (users) => {
      setOnlineUsers(Array.isArray(users) ? users : []);
    });

    // Bridge inbound messages to global DOM events so DoctorContext / unread
    // badges keep updating even when no chat panel is open.
    newSocket.on('receiveMessage', (message) => {
      window.dispatchEvent(new CustomEvent('newMessage', {
        detail: { appointmentId: message.appointmentId, message },
      }));
    });

    newSocket.on('unreadCountUpdate', (data) => {
      window.dispatchEvent(new CustomEvent('unreadCountUpdate', { detail: data }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.removeAllListeners();
      newSocket.disconnect();
      setSocket(null);
    };
  }, [currentUserId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
