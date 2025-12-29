import { useEffect, useState } from "react";
import { socket } from "./socket";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [users, setUsers] = useState([]);

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

    return () => {
      socket.disconnect();
      socket.off("room:created");
      socket.off("room:joined");
      socket.off("room:users");
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
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
