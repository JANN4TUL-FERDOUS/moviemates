export default function Controls({
  isPlaying,
  togglePlay,
  seekForward,
  openFile,
  users = [],
  setShowChat,
  setShowUsers,
  requestFull,
  leaveRoom,
}) {
  return (
    <div className="controls">
      <button onClick={togglePlay}>
        {isPlaying ? "⏸" : "▶"}
      </button>

      <button onClick={seekForward}>⏩</button>

      <button onClick={openFile}>📁</button>

      <button
        onClick={() => {
          setShowChat((p) => !p);
          setShowUsers(false);
        }}
      >
        💬
      </button>

      <button
        onClick={() => {
          setShowUsers((p) => !p);
          setShowChat(false);
        }}
      >
        👥 {users.length}
      </button>

      <button onClick={requestFull}>⛶</button>

      <button className="leave" onClick={leaveRoom}>
        Leave
      </button>
    </div>
  );
}
