import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const requireLogin = (socket) => {
  if (!socket.user) {
    socket.emit("room:error", "Please login first");
    return false;
  }
  return true;
};

const rooms = {};
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const roomId in rooms) {
      const room = rooms[roomId];

      room.users = room.users.filter(
        (u) => u.socketId !== socket.id
      );

      if (room.users.length === 0) {
        delete rooms[roomId];
        console.log(`Room deleted: ${roomId}`);
      } else {
        io.to(roomId).emit("room:users", room.users);
      }
    }
  });

  socket.on("user:login", (user) => {
    console.log("User logged in:", user.name);
    socket.user = user;
  });

  socket.on("room:create", () => {
    if (!requireLogin(socket)) return;

    const roomId = Math.random().toString(36).substring(2, 8);

    rooms[roomId] = {
      hostId: socket.id,
      users: [{ ...socket.user, socketId: socket.id }],
    };

    socket.join(roomId);

    socket.emit("room:created", {
      roomId,
      isHost: true,
    });

    io.to(roomId).emit("room:users", rooms[roomId].users);

    console.log(`Room created: ${roomId}`);
  });

  socket.on("room:join", (roomId) => {
    if (!requireLogin(socket)) return;

    const room = rooms[roomId];

    if (!room) {
      socket.emit("room:error", "Room not found");
      return;
    }

    const userExists = room.users.some(
      (u) => u.id === socket.user.id
    );

    if (!userExists) {
      room.users.push({ ...socket.user, socketId: socket.id });
    }

    socket.join(roomId);

    socket.emit("room:joined", {
      roomId,
      isHost: false,
    });

    io.to(roomId).emit("room:users", room.users);

    console.log(`User joined room: ${roomId}`);
  });




});
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
