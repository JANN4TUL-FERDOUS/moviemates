import { useState, useRef } from "react";

export default function RoomInfo({ roomId, onLeave }) {
  const [toast, setToast] = useState("");
  const timer = useRef(null);

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);

    setToast("Copied to clipboard");

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setToast("");
    }, 2500); 
  };

  return (
    <>
      <div className="room-info-bar">
        <div>
          🎬 Room ID: <b>{roomId}</b>
          <button onClick={copyRoomId}>Copy</button>
        </div>
        <button onClick={onLeave} className="btn-leave-room"> Leave</button>
        
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
