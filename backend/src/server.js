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
const roomVideos = {}; 

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
        delete roomVideos[roomId];
        console.log(`Room deleted: ${roomId}`);
      } 
      else {
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
      video: {
        time: 0,
        isPlaying: false,
        updatedAt: Date.now(),
      },
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
  socket.on("room:leave", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    room.users = room.users.filter(
      u => u.socketId !== socket.id
    );

    room.video = {
      time: 0,
      isPlaying: false,
      updatedAt: Date.now(),
    };

    socket.leave(roomId);

    io.to(roomId).emit("room:users", room.users);
  });

  socket.on("chat:send", ({ roomId, text }) => {
    if (!socket.user || !roomId) return;

    const message = {
      user: {
        id: socket.user.id,
        name: socket.user.name,
        avatar: socket.user.avatar,
      },
      text,
      timestamp: new Date().toISOString(),
    };

    io.to(roomId).emit("chat:message", message);
  });
  socket.on("video:meta", (meta) => {
    const { roomId } = meta;
    const room = rooms[roomId];

    if (!room) return;

    if (socket.id !== room.hostId) {
      const hostVideo = roomVideos[roomId];

      if (!hostVideo) {
        socket.emit("video:error", "Host has not uploaded yet");
        return;
      }

      const isMatch =
        hostVideo.name === meta.name &&
        hostVideo.size === meta.size &&
        Math.abs(hostVideo.duration - meta.duration) < 1;

      if (!isMatch) {
        socket.emit("video:mismatch", hostVideo);
      } else {
        socket.emit("video:accepted");
      }

      return;
    }

    
    roomVideos[roomId] = meta;
    socket.emit("video:accepted");
  });


  // ---------------- VIDEO EVENTS ----------------

  const validTime = (t) =>
    typeof t === "number" && isFinite(t) && t >= 0;

  socket.on("video:play", ({ roomId, time }) => {
    const room = rooms[roomId];
    if (!room || room.hostId !== socket.id || !validTime(time)) return;

    room.video = {
      time,
      isPlaying: true,
      updatedAt: Date.now(),
    };

    io.to(roomId).emit("video:play", room.video);
  });

  socket.on("video:pause", ({ roomId, time }) => {
    const room = rooms[roomId];
    if (!room || room.hostId !== socket.id || !validTime(time)) return;

    room.video = {
      time,
      isPlaying: false,
      updatedAt: Date.now(),
    };

    io.to(roomId).emit("video:pause", room.video);
  });

  socket.on("video:seek", ({ roomId, time }) => {
    const room = rooms[roomId];
    if (!room || room.hostId !== socket.id || !validTime(time)) return;

    room.video.time = time;
    room.video.updatedAt = Date.now();

    io.to(roomId).emit("video:seek", {
      time,
      updatedAt: room.video.updatedAt,
    });
  });

  socket.on("video:request-state", (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    socket.emit("video:state", {
      ...room.video,
      hostId: room.hostId,
    });
  });


});
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});