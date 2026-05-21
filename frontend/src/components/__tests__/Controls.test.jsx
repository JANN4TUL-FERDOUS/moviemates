import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Controls from "../Controls";

describe("Controls Component", () => {
  test("calls togglePlay when play button clicked", () => {
    const togglePlay = vi.fn();

    render(
      <Controls
        isPlaying={false}
        togglePlay={togglePlay}
        seekForward={vi.fn()}
        seekBackward={vi.fn()}
        openFile={vi.fn()}
        users={[]}
        setShowChat={vi.fn()}
        setShowUsers={vi.fn()}
        requestFull={vi.fn()}
      />
    );

    const playButton = screen.getByText("▶");

    fireEvent.click(playButton);

    expect(togglePlay).toHaveBeenCalled();
  });

  test("shows correct user count", () => {
    render(
      <Controls
        isPlaying={false}
        togglePlay={vi.fn()}
        seekForward={vi.fn()}
        seekBackward={vi.fn()}
        openFile={vi.fn()}
        users={[{}, {}, {}]}
        setShowChat={vi.fn()}
        setShowUsers={vi.fn()}
        requestFull={vi.fn()}
      />
    );

    expect(screen.getByText(/3/)).toBeInTheDocument();
  });
});