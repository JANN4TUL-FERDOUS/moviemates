import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import VideoPlayer from "../VideoPlayer";

describe("VideoPlayer Component", () => {
  test("shows upload UI when no video source", () => {
    render(
      <VideoPlayer
        videoRef={{ current: null }}
        fileInputRef={{ current: null }}
        videoSrc={null}
        loadVideo={vi.fn()}
        currentTime={0}
        duration={0}
        onSeek={vi.fn()}
        isHost={true}
      />
    );

    expect(
      screen.getByText("Upload your movie")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Choose file")
    ).toBeInTheDocument();
  });

  test("renders video player when video source exists", () => {
    render(
      <VideoPlayer
        videoRef={{ current: null }}
        fileInputRef={{ current: null }}
        videoSrc="movie.mp4"
        loadVideo={vi.fn()}
        currentTime={10}
        duration={100}
        onSeek={vi.fn()}
        isHost={true}
        isPlaying={false}
        togglePlay={vi.fn()}
        seekForward={vi.fn()}
        seekBackward={vi.fn()}
        users={[]}
        setShowChat={vi.fn()}
        setShowUsers={vi.fn()}
        requestFull={vi.fn()}
      />
    );

    const video =
      document.querySelector("video");

    expect(video).toBeInTheDocument();
  });

  test("calls loadVideo when file selected", () => {
    const loadVideo = vi.fn();

    render(
      <VideoPlayer
        videoRef={{ current: null }}
        fileInputRef={{ current: null }}
        videoSrc={null}
        loadVideo={loadVideo}
        currentTime={0}
        duration={0}
        onSeek={vi.fn()}
        isHost={true}
      />
    );

    const input =
      document.querySelector(
        'input[type="file"]'
      );

    const file = new File(
      ["video"],
      "movie.mp4",
      { type: "video/mp4" }
    );

    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });

    expect(loadVideo).toHaveBeenCalled();
  });
});