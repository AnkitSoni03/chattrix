import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    let newSocket;

    if (authUser) {
      // connect socket
      newSocket = io("https://chattrix-jxmd.onrender.com/", {
        query: { userId: authUser?._id },
      });

      // listen online users
      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUser(users);
      });

      setSocket(newSocket);
    }

    // cleanup function
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
