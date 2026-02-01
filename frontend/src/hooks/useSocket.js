import { useEffect } from "react";
import { socket } from "../socket";

export default function useSocket({
  setCurrentRoom,
  setIsHost,
  setUsers,
  setIsPlaying,
  setMessages,
  videoRef,
}) {
  useEffect(() => {
    socket.connect();

    socket.on("room:created", ({ roomId, isHost }) => {
      setCurrentRoom(roomId);
      setIsHost(isHost);
    });

    socket.on("room:joined", ({ roomId }) => {
      setCurrentRoom(roomId);
      setIsHost(false);
      socket.emit("video:request-state", roomId);
    });

    socket.on("room:users", setUsers);

    socket.on("video:state", ({ time, isPlaying, updatedAt }) => {
      if (!videoRef.current) return;

      const now = Date.now();
      const networkDelay = updatedAt ? (now - updatedAt) / 1000 : 0;

      const targetTime = isPlaying
        ? time + networkDelay
        : time;

      const currentTime = videoRef.current.currentTime;
      const diff = Math.abs(currentTime - targetTime);

      if (diff > 0.01) {
        videoRef.current.currentTime = targetTime;
      }

      if (isPlaying && videoRef.current.paused) {
        videoRef.current.play();
      }

      if (!isPlaying && !videoRef.current.paused) {
        videoRef.current.pause();
      }

      setIsPlaying(isPlaying);
    });



    const handleChat = (msg) => {
      setMessages((m) => [...m, msg]);
    };

    socket.on("chat:message", handleChat);

    return () => {
      socket.off("room:created");
        socket.off("room:joined");
        socket.off("room:users");
        socket.off("video:state");
        socket.off("chat:message");
        socket.disconnect();
    };
  }, []);
}