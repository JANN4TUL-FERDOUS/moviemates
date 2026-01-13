import { useState } from "react";

export default function SeekBar({ currentTime, duration, onSeek, isHost }) {
  const handleClick = (e) => {
    if (!isHost) return; 

    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    onSeek(newTime);
  };

  return (
    <div className="seek-bar">
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime || 0}
        disabled={!isHost}
        readOnly={!isHost} 
        onChange={(e) => isHost && onSeek(Number(e.target.value))}
        onClick={handleClick}
      />
      <div className="time">
        {format(currentTime)} / {format(duration)}
      </div>
    </div>
  );
}

function format(seconds = 0) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
