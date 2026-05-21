import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import RoomInfo from "../RoomInfo";

describe("RoomInfo Component", () => {
  test("copies room ID to clipboard", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });

    render(
      <RoomInfo
        roomId="ROOM123"
        onLeave={vi.fn()}
      />
    );

    const copyButton = screen.getByText("Copy");

    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText)
      .toHaveBeenCalledWith("ROOM123");

    expect(
      await screen.findByText("Copied to clipboard")
    ).toBeInTheDocument();
  });

  test("calls onLeave when Leave button clicked", () => {
    const onLeave = vi.fn();

    render(
      <RoomInfo
        roomId="ROOM123"
        onLeave={onLeave}
      />
    );

    const leaveButton =
      screen.getByText("Leave");

    fireEvent.click(leaveButton);

    expect(onLeave).toHaveBeenCalled();
  });
});