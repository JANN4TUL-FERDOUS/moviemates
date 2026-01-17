import { useState } from "react";

export default function RoomInfo({ roomId }) {
  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);

    const toast = document.getElementById("toast");
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  };

  return (
    <div className="room-info-bar">
      🎬 Room ID: <b>{roomId}</b>

      <button onClick={copyRoomId}>
        Copy
      </button>

      <div id="toast">✔ Room ID copied!</div>
    </div>
  );
}
