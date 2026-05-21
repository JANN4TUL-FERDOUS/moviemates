import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SeekBar from "../SeekBar";

describe("SeekBar Component", () => {
  test("calls onSeek when host clicks seek bar", () => {
    const onSeek = vi.fn();

    render(
      <SeekBar
        currentTime={30}
        duration={100}
        onSeek={onSeek}
        isHost={true}
      />
    );

    const seekBar =
      document.querySelector(".seek-bar");

    // Mock dimensions
    const input =
      seekBar.querySelector("input");

    input.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      width: 100,
    }));

    fireEvent.click(seekBar, {
      clientX: 50,
    });

    expect(onSeek).toHaveBeenCalled();
  });

  test("does not call onSeek for non-host", () => {
    const onSeek = vi.fn();

    render(
      <SeekBar
        currentTime={30}
        duration={100}
        onSeek={onSeek}
        isHost={false}
      />
    );

    const seekBar =
      document.querySelector(".seek-bar");

    fireEvent.click(seekBar, {
      clientX: 50,
    });

    expect(onSeek).not.toHaveBeenCalled();
  });
});