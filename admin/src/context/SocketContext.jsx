import { createContext, useState, useEffect, useContext } from "react";
import { AppContext } from "./AppContext.jsx";
import { DoctorContext } from "./DoctorContext.jsx";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userData } = useContext(AppContext);
  const { profileData } = useContext(DoctorContext);

  // Use userData from AppContext (for users) or profileData from DoctorContext (for doctors)
  const currentUser = userData || profileData;

  useEffect(() => {
    if (currentUser && currentUser._id) {
      if (socket && socket.connected) return;
      // Dev: Vite proxies /socket.io to local backend. Prod: separate always-on host.
      const socketUrl = import.meta.env.DEV ? '/' : (import.meta.env.VITE_SOCKET_URL || '/');
      const newSocket = io(socketUrl, {
        path: '/socket.io',
        query: { userId: currentUser._id },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        withCredentials: true,
      });
      newSocket.on("connect", () => {
        setOnlineUsers(prev => [...prev, currentUser._id]);
      });
      newSocket.on("disconnect", () => {
        setOnlineUsers(prev => prev.filter(id => id !== currentUser._id));
      });
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
      
      // Listen for new messages
      newSocket.on('receiveMessage', (message) => {
        // Dispatch custom event for components to handle
        window.dispatchEvent(new CustomEvent('newMessage', {
          detail: {
            appointmentId: message.appointmentId,
            message
          }
        }));
      });

      // Bridge unreadCountUpdate socket event to DOM event
      newSocket.on('unreadCountUpdate', (data) => {
        window.dispatchEvent(new CustomEvent('unreadCountUpdate', { detail: data }));
      });
      
      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setOnlineUsers([]);
    }
  }, [currentUser]);

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

export default SocketContext; 