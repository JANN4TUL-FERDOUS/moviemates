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

    socket.on("video:play", ({ time }) => {
      videoRef.current.currentTime = time;
      videoRef.current.play();
      setIsPlaying(true);
    });

    socket.on("video:pause", ({ time }) => {
      videoRef.current.currentTime = time;
      videoRef.current.pause();
      setIsPlaying(false);
    });

    socket.on("video:seek", ({ time }) => {
      videoRef.current.currentTime = time;
    });

    socket.on("video:state", ({ time, isPlaying }) => {
      videoRef.current.currentTime = time;
      isPlaying
        ? videoRef.current.play()
        : videoRef.current.pause();
      setIsPlaying(isPlaying);
    });

    const handleChat = (msg) => {
      setMessages((m) => [...m, msg]);
    };

    socket.on("chat:message", handleChat);

    return () => {
      socket.off("chat:message", handleChat);
      socket.disconnect();
    };
  }, []);
}
