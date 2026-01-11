import { socket } from "../socket";

export default function RoomJoin({
  roomId,
  setRoomId,
}) {
  return (
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
  );
}
