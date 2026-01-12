import { useRef, useState } from "react";
import "./App.css";
import { socket } from "./socket";
import useSocket from "./hooks/useSocket";
import { handleLogin } from "./services/auth";

import Header from "./components/Header";
import Landing from "./components/Landing";
import RoomJoin from "./components/RoomJoin";
import VideoPlayer from "./components/VideoPlayer";
import SidePanel from "./components/SidePanel";

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
  const [hostId, setHostId]= useState(null);

  useSocket({
    setCurrentRoom,
    setIsHost,
    setUsers,
    setIsPlaying,
    setMessages,
    videoRef,
    setHostId
  });

  const login = (res) => {
    const u = handleLogin(res);
    setUser(u);
    socket.emit("user:login", u);
  };

  const loadVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoSrc(URL.createObjectURL(file));
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
        onLogout={() => setUser(null)}
      />

      {!user && <Landing />}

      {user && !currentRoom && (
        <RoomJoin
          roomId={roomId}
          setRoomId={setRoomId}
        />
      )}

      {currentRoom && (
        <div className="room-layout">
          <VideoPlayer
            videoRef={videoRef}
            fileInputRef={fileInputRef}
            videoSrc={videoSrc}
            loadVideo={loadVideo}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            seekForward={seekForward}
            users={users}
            setShowChat={setShowChat}
            setShowUsers={setShowUsers}
            requestFull={() =>
              videoRef.current.requestFullscreen()
            }
            leaveRoom={() => {
              setCurrentRoom(null);
              setMessages([]);
              setVideoSrc(null);
              setShowChat(false);
              setShowUsers(false);
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
            />
          )}
        </div>
      )}
    </div>
  );
}
