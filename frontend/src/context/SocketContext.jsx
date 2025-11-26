import { createContext, useState, useEffect, useContext } from "react";
import { AppContext } from "./AppContext.jsx";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userData } = useContext(AppContext);

  useEffect(() => {
    if (userData && userData._id) {
      if (socket && socket.connected) return;
      const socketUrl = import.meta.env.MODE === 'production' ? '/' : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000');
      const newSocket = io(socketUrl, {
        query: { userId: userData._id },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        withCredentials: true,
      });
      newSocket.on("connect", () => {
        setOnlineUsers(prev => [...prev, userData._id]);
      });
      newSocket.on("disconnect", () => {
        setOnlineUsers(prev => prev.filter(id => id !== userData._id));
      });
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
      
      // Listen for new messages
      newSocket.on("receiveMessage", (message) => {
        console.log('SocketContext: Received message:', message);
        // Dispatch custom event for components to handle
        window.dispatchEvent(new CustomEvent('newMessage', {
          detail: {
            appointmentId: message.appointmentId,
            message: message
          }
        }));
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
  }, [userData]);

  return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

export default SocketContext; 