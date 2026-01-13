import Controls from "./Controls";
import SeekBar from "./SeekBar";

export default function VideoPlayer({
  videoRef,
  videoSrc,
  loadVideo,
  fileInputRef,
  currentTime,
  duration,
  onSeek,
  isHost,
  ...props
}) {
  return (
    <div className="video-wrapper">
      {!videoSrc ? (
        <div className="upload-center">
          <h3>Upload your movie</h3>
          <label className="upload-big">
            Choose file
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={loadVideo}
            />
          </label>
        </div>
      ) : (
        <>
          <video ref={videoRef} src={videoSrc} />
          
          <SeekBar
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
            isHost={isHost} 
          />
          <Controls
            {...props}
            openFile={() =>
              fileInputRef.current.click()
            }
          />

          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={loadVideo}
          />
        </>
      )}
    </div>
  );
}
