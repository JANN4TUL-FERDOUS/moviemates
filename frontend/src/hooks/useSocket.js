import { useEffect } from "react";
import { socket } from "../socket";

export default function useSocket({
  setCurrentRoom,
  setIsHost,
  setUsers,
  setIsPlaying,
  setMessages,
  videoRef,
  setVideoSrc,
  setIsVideoBlocked,
  showToast,
}) {
  useEffect(() => {

    const events = [
      "room:created",
      "room:joined",
      "room:users",
      "room:host-changed",
      "video:mismatch",
      "video:state",
      "video:block",
      "video:error",
      "chat:message"
    ];

    events.forEach(event => socket.off(event));
    
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

    socket.on("room:host-changed", ({ hostId }) => {
      setIsHost(socket.id === hostId);
    });
    
    socket.on("video:error", (msg) => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }

      setVideoSrc(null);
      setIsVideoBlocked(true);

      showToast(`⚠️ ${msg}`);
    });

    socket.on("video:mismatch", () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }

      setVideoSrc(null);
      setIsVideoBlocked(true);

      showToast("❌ Wrong file. Please upload the same file as the host.");
    });

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

    socket.on("video:block", ({ name, hostId }) => {
      if (socket.id === hostId) return;
      
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute("src");
        videoRef.current.load();
      }

      setVideoSrc(null);
      setIsVideoBlocked(true);

      showToast(
        `🎬 The host has selected "${name}". Upload the same file to continue watching together.`
      );
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
      socket.off("video:mismatch");
      socket.off("chat:message");
      socket.off("video:block");
      socket.off("room:host-changed");
      socket.off("video:error");
    };
  }, []);
}