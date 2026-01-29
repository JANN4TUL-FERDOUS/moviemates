import { useRef, useState, useEffect} from "react";
import "./App.css";
import { socket } from "./socket";
import useSocket from "./hooks/useSocket";
import { handleLogin } from "./services/auth";

import Header from "./components/Header";
import Landing from "./components/Landing";
import RoomJoin from "./components/RoomJoin";
import VideoPlayer from "./components/VideoPlayer";
import SidePanel from "./components/SidePanel";
import RoomInfo from "./components/RoomInfo";


export default function App() {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [videoSrc, setVideoSrc] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useSocket({
    setCurrentRoom,
    setIsHost,
    setUsers,
    setIsPlaying,
    setMessages,
    videoRef,
  });
  useEffect(() => {
    socket.on("video:error", (msg) => {
      alert(msg);
      setVideoSrc(null);
    });

    socket.on("video:mismatch", () => {
      alert("❌ Wrong movie! Upload the same file as host.");
      setVideoSrc(null);
      videoRef.current?.pause();
    });

    return () => {
      socket.off("video:error");
      socket.off("video:mismatch");
    };
  }, []);

  useEffect(() => {
    if (!currentRoom || isHost) return;

    const interval = setInterval(() => {
      if (videoRef.current?.readyState >= 2) {
        socket.emit("video:request-state", currentRoom);
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [currentRoom]);

  useEffect(() => {
    socket.on("video:state", ({ time, isPlaying, updatedAt }) => {
      const video = videoRef.current;
      if (!video) return;

      // latency correction
      const diff = (Date.now() - updatedAt) / 1000;
      const finalTime = isPlaying ? time + diff : time;

      video.currentTime = finalTime;

      isPlaying ? video.play() : video.pause();

      setCurrentTime(finalTime);
      setIsPlaying(isPlaying);
    });

    return () => socket.off("video:state");
  }, []);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime); 
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setDuration(video.duration);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const interval = setInterval(() => {
      if (!video.paused) {
        setCurrentTime(video.currentTime); 
      }
    }, 200); 

    return () => clearInterval(interval);
  }, [videoSrc]);
  


  const login = (res) => {
    const u = handleLogin(res);
    setUser(u);
    socket.emit("user:login", u);
  };
  const handleLogout = () => {
    setUser(null);
    setCurrentRoom(null);
    setUsers([]);
    setMessages([]);
    setVideoSrc(null);
    setIsHost(false);
    setIsPlaying(false);
    setShowChat(false);
    setShowUsers(false);

    socket.disconnect();
  };

  const loadVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const video = document.createElement("video");
    video.preload = "metadata";
    
    video.onloadedmetadata = () => {
      const meta = {
        name: file.name,
        size: file.size,
        duration: video.duration,
        roomId: currentRoom
      };

      socket.emit("video:meta", meta);
      socket.once("video:accepted", () => {
        setVideoSrc(URL.createObjectURL(file));
      });
    };


    video.src = URL.createObjectURL(file);
  };


  const togglePlay = () => {
    if (!isHost) return;
    const time = videoRef.current.currentTime;

    videoRef.current.paused
      ? socket.emit("video:play", {
          roomId: currentRoom,
          time,
        })
      : socket.emit("video:pause", {
          roomId: currentRoom,
          time,
        });
  };

  const seekForward = () => {
    if (!isHost) return;
    socket.emit("video:seek", {
      roomId: currentRoom,
      time: videoRef.current.currentTime + 10,
    });
  };
  const seekBackward = () => {
    if (!isHost) return;
    socket.emit("video:seek", {
      roomId:currentRoom,
      time: Math.max(
        0,
        videoRef.current.currentTime-10
      ),
    });
  };
  const handleSeek = (time) => {
    if (!isHost) return;

    // Clamp time between 0 and actual video duration
    const video = videoRef.current;
    if (!video || !duration) return;

    const clampedTime = Math.min(Math.max(time, 0), video.duration);

    video.currentTime = clampedTime; // update video
    setCurrentTime(clampedTime); // update UI immediately

    socket.emit("video:seek", {
      roomId: currentRoom,
      time: clampedTime,
    });
  };


  const sendMessage = () => {
    if (!chatInput.trim()) return;

    socket.emit("chat:send", {
      roomId: currentRoom,
      text: chatInput,
    });

    setChatInput("");
  };

  return (
    <div className="app">
      <Header
        user={user}
        onLogin={login}
        onLogout={handleLogout}
      />

      {!user && <Landing />}

      {user && !currentRoom && (
        <RoomJoin
          roomId={roomId}
          setRoomId={setRoomId}
          setCurrentRoom={setCurrentRoom}
          setIsHost={setIsHost}
        />
      )}

      {user && currentRoom && (
        <>
          <RoomInfo roomId={currentRoom} />

          <div className="room-layout">
          <VideoPlayer
            videoRef={videoRef}
            fileInputRef={fileInputRef}
            videoSrc={videoSrc}
            loadVideo={loadVideo}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            seekForward={seekForward}
            seekBackward={seekBackward}
            users={users}
            setShowChat={setShowChat}
            setShowUsers={setShowUsers}
            currentTime={currentTime}   
            duration={duration}        
            onSeek={handleSeek}         
            isHost={isHost}   
            requestFull={() =>
              videoRef.current.requestFullscreen()
            }
            leaveRoom={() => {
              socket.emit("room:leave", currentRoom);

              const video = videoRef.current;

              if (video) {
                video.pause();
                video.currentTime = 0;
                video.removeAttribute("src"); 
                video.load();                
              }

              setVideoSrc(null);
              setIsPlaying(false);
              setCurrentTime(0);
              setDuration(0);
              setMessages([]);
              setShowChat(false);
              setShowUsers(false);
              setCurrentRoom(null);
            }}

          />

          {(showChat || showUsers) && (
            <SidePanel
              showChat={showChat}
              showUsers={showUsers}
              users={users}
              messages={messages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              sendMessage={sendMessage}
              currentUser={user}
            />
          )}
        </div>
        
        </>
      )}
    </div>
  );
}