import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { AppContext } from "./AppContext.jsx";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userData } = useContext(AppContext);

  // Depend only on the stable userId string so a profile refetch (which
  // returns a fresh object reference) doesn't tear down and recreate the
  // socket. Otherwise inbound messages get dropped during reconnect.
  const currentUserId = useMemo(() => userData?._id || null, [userData?._id]);

  useEffect(() => {
    if (!currentUserId) {
      setOnlineUsers([]);
      return undefined;
    }

    // Dev: Vite proxies /socket.io to the local backend (same-origin).
    // Prod: socket server lives on a separate always-on host (Lambda can't
    // hold WebSockets), so we point at VITE_SOCKET_URL directly.
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
