import { useEffect, useState } from "react";
import { socket } from "./socket";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }


    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("room:created", ({ roomId }) => {
      setCurrentRoom(roomId);
    });

    socket.on("room:joined", ({ roomId }) => {
      setCurrentRoom(roomId);
      shousetRoomId("");
    });

    socket.on("room:users", (usersList) => {
      setUsers(usersList);
    });

    socket.on("room:error", (msg) => {
      alert(msg);
    });
    socket.on("chat:message", (message) => {
      setMessages((prev) => [...prev, message]);
    });


    return () => {
      socket.disconnect();
      socket.off("room:created");
      socket.off("room:joined");
      socket.off("room:users");
      socket.off("room:error");
      socket.off("chat:message"); 
    };
  }, []);


  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    const userData = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      avatar: decoded.picture,
    };

    setUser(userData);
    socket.emit("user:login", userData);
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
    <div style={{ padding: "2rem" }}>
      <h1>🎬 MovieMates</h1>

      {!user ? (
        <GoogleLogin onSuccess={handleLoginSuccess} />
      ) : (
        <>
          {/* User info */}
          <div>
            <img src={user.avatar} alt="avatar" width={60} />
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>

          {/*  Room UI */}
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => socket.emit("room:create")}
              disabled={currentRoom}
            >
              Create Room
            </button>

            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              style={{ marginLeft: "0.5rem" }}
            />

            <button
              onClick={() => socket.emit("room:join", roomId)}
              disabled={currentRoom || !roomId}
              style={{ marginLeft: "0.5rem" }}
            >
              Join Room
            </button>
            {currentRoom && (
              <div style={{ marginTop: "1.5rem" }}>
                <h3>Room ID: {currentRoom}</h3>

                <h4>Users in Room:</h4>
                <ul>
                  {users.map((u) => (
                    <li key={u.id}>
                      <img src={u.avatar} alt="" width={30} /> {u.name}
                    </li>
                  ))}
                </ul>
                {/* ================= CHAT ================= */}
                <div style={{ marginTop: "1rem" }}>
                  <h4>Chat</h4>

                  <div
                    style={{
                      border: "1px solid #ccc",
                      height: "200px",
                      overflowY: "auto",
                      padding: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {messages.map((msg, i) => (
                      <div key={i} style={{ marginBottom: "0.3rem" }}>
                        <img src={msg.user.avatar} alt="" width={20} />{" "}
                        <strong>{msg.user.name}:</strong> {msg.text}
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    style={{ width: "75%" }}
                  />

                  <button onClick={sendMessage} style={{ marginLeft: "0.5rem" }}>
                    Send
                  </button>
                </div>

              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
