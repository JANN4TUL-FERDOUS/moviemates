export default function SeekBar({
  currentTime,
  duration,
  onSeek,
  disabled,
}) {
  return (
    <div className="seek-bar">
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={currentTime}
        onChange={(e) => 
            !disabled && onSeek(Number(e.target.value))
        }
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
