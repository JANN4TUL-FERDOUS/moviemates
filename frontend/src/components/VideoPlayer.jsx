import Controls from "./Controls";

export default function VideoPlayer({
  videoRef,
  videoSrc,
  loadVideo,
  fileInputRef,
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
