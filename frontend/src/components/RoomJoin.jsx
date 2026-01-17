import { useState } from "react";
import { socket } from "../socket";

export default function RoomJoin({ roomId, setRoomId, setCurrentRoom, setIsHost }) {
  const [createdRoomId, setCreatedRoomId] = useState("");

  const handleCreateRoom = () => {
    socket.emit("room:create");
    socket.once("room:created", ({ roomId, isHost }) => {
      setCreatedRoomId(roomId);
      setCurrentRoom(roomId);
      setIsHost(isHost);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}?room=${createdRoomId}`);
    alert("Room link copied to clipboard!");
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) return;
    socket.emit("room:join", roomId);
    socket.once("room:joined", () => {
      setCurrentRoom(roomId);
      setIsHost(false);
    });
  };

  return (
    <div className="room-join-card">
      <h2>Let's Watch Movies Together</h2>

      <div className="room-section">
        <h3>Create a Room</h3>
        <p>Create a new room and share the link with friends.</p>
        <button className="btn-primary" onClick={handleCreateRoom}>
          Create Room
        </button>

        {createdRoomId && (
          <div className="room-link">
            <input type="text" value={`${window.location.origin}?room=${createdRoomId}`} readOnly />
            <button onClick={handleCopyLink}>Copy Link</button>
          </div>
        )}
      </div>

      <hr />

      <div className="room-section">
        <h3>Join a Room</h3>
        <p>Enter the Room ID or paste an invite link to join.</p>
        <input
          type="text"
          placeholder="Enter Room ID or link"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button className="btn-secondary" onClick={handleJoinRoom}>
          Join Room
        </button>
      </div>
    </div>
  );
}
