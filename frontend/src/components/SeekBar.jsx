import { useState } from "react";

export default function SeekBar({ currentTime, duration, onSeek, isHost }) {
  const handleClick = (e) => {
    if (!isHost) return;

    // Get the <input> range element
    const bar = e.currentTarget.querySelector("input");
    const rect = bar.getBoundingClientRect();

    // Calculate percentage click
    const clickX = e.clientX - rect.left;
    const percent = Math.min(Math.max(clickX / rect.width, 0), 1);

    const newTime = percent * duration;
    onSeek(newTime);
  };

  return (
    <div className="seek-bar" onClick={handleClick}>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.01}
        value={currentTime || 0}
        readOnly // host updates via click only
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
