import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { socket } from "./socket";
import "./App.css";

export default function App() {
  const videoRef = useRef(null);

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

  /* ---------------- SOCKET ---------------- */

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
      isPlaying ? videoRef.current.play() : videoRef.current.pause();
      setIsPlaying(isPlaying);
    });

    socket.on("chat:message", (msg) =>
      setMessages((m) => [...m, msg])
    );

    return () => socket.disconnect();
  }, []);

  /* ---------------- AUTH ---------------- */

  const login = (res) => {
    const d = jwtDecode(res.credential);
    const u = {
      id: d.sub,
      name: d.name,
      avatar: d.picture,
    };
    setUser(u);
    socket.emit("user:login", u);
  };

  /* ---------------- VIDEO ---------------- */

  const loadVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoSrc(URL.createObjectURL(file));
  };

  const togglePlay = () => {
    if (!isHost) return;
    const time = videoRef.current.currentTime;

    if (videoRef.current.paused) {
      socket.emit("video:play", { roomId: currentRoom, time });
    } else {
      socket.emit("video:pause", { roomId: currentRoom, time });
    }
  };

  const seekForward = () => {
    if (!isHost) return;
    const time = videoRef.current.currentTime + 10;
    socket.emit("video:seek", { roomId: currentRoom, time });
  };
  const sendMessage = () => {
    if (!chatInput.trim()) return;

    socket.emit("chat:send", {
      roomId: currentRoom,
      text: chatInput,
    });

    setChatInput("");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="app">
      <header className="header">
        <h2>🎬 MovieMates</h2>

        {!user ? (
          <GoogleLogin onSuccess={login} />
        ) : (
          <div className="user">
            <img src={user.avatar} />
            <span>{user.name}</span>
            <button onClick={() => setUser(null)}>Logout</button>
          </div>
        )}
      </header>

      {!user && (
        <div className="landing">
          <h1>Watch movies together. In sync.</h1>
          <p>Create a room, load the same movie, enjoy.</p>
        </div>
      )}

      {user && !currentRoom && (
        <div className="room-box">
          <button onClick={() => socket.emit("room:create")}>
            Create Room
          </button>

          <input
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button onClick={() => socket.emit("room:join", roomId)}>
            Join Room
          </button>
        </div>
      )}

      {currentRoom && (
        <div className="video-layout">
          <div className="video-wrapper">
            <input type="file" accept="video/*" onChange={loadVideo} />

            {videoSrc && (
              <>
                <video ref={videoRef} src={videoSrc} />

                <div className="controls">
                  <button onClick={togglePlay}>
                    {isPlaying ? "⏸" : "▶"}
                  </button>
                  <button onClick={seekForward}>⏩</button>
                  <button
                    onClick={() => {
                      setShowChat(!showChat);
                      setShowUsers(false);
                    }}
                  >
                    💬
                  </button>

                  <button
                    onClick={() => {
                      setShowUsers(!showUsers);
                      setShowChat(false);
                    }}
                  >
                    👥 {users.length}
                  </button>

                  <button onClick={() => videoRef.current.requestFullscreen()}>
                    ⛶
                  </button>
                  <button
                    className="leave"
                    onClick={() => {
                      setCurrentRoom(null);
                      setMessages([]);
                      setVideoSrc(null);
                      setShowChat(false);
                      setShowUsers(false);
                    }}
                  >
                    Leave
                  </button>
                </div>
              </>
            )}
          </div>
          {(showChat || showUsers) && (
            <div className="side-panel">
              {showUsers && (
                <>
                  <h3>👥 Users</h3>
                  <ul className="user-list">
                    {users.map((u) => (
                      <li key={u.id}>
                        <img src={u.avatar} />
                        {u.name}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {showChat && (
                <>
                  <h3>💬 Chat</h3>
                  <div className="chat-messages">
                    {messages.map((m, i) => (
                      <div key={i}>
                        <strong>{m.user.name}:</strong> {m.text}
                      </div>
                    ))}
                  </div>

                  <div className="chat-input">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}     

    </div>
  );
}
