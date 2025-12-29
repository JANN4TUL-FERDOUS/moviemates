import { useEffect, useState } from "react";
import { socket } from "./socket";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // Socket listeners
    socket.on("room:created", ({ roomId }) => {
      alert(`Room created: ${roomId}`);
    });

    socket.on("room:joined", ({ roomId }) => {
      alert(`Joined room: ${roomId}`);
    });

    socket.on("room:error", (msg) => {
      alert(msg);
    });

    return () => {
      socket.disconnect();
      socket.off("room:created");
      socket.off("room:joined");
      socket.off("room:error");
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
            <button onClick={() => socket.emit("room:create")}>
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
              style={{ marginLeft: "0.5rem" }}
            >
              Join Room
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
