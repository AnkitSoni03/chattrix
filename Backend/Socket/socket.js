import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://chattrix-jxmd.onrender.com/"],
    // origin: ["http://localhost:5173/"],
    methods: ["GET", "POST"],
  },
});

// User socket map {userId: socketId}
const userSocketmap = {};

export const getReciverSocketId = (receverId) => {
  return userSocketmap[receverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  //  correct undefined check
  if (userId && userId !== "undefined") {
    userSocketmap[userId] = socket.id;
  }

  // Send online users
  io.emit("getOnlineUsers", Object.keys(userSocketmap));

  socket.on("disconnect", () => {
    delete userSocketmap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketmap));
  });
});

export { app, io, server };
