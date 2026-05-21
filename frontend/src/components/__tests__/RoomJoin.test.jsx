import { render, screen, fireEvent } from "@testing-library/react";
import RoomJoin from "../RoomJoin";
import { vi } from "vitest";

vi.mock("../../socket", () => ({
  socket: {
    emit: vi.fn(),
    once: vi.fn(),
  },
}));

describe("RoomJoin Component", () => {
  test("renders create room button", () => {
    render(
      <RoomJoin
        roomId=""
        setRoomId={() => {}}
        setCurrentRoom={() => {}}
        setIsHost={() => {}}
      />
    );

    expect(
      screen.getByText(/Create Room/i)
    ).toBeInTheDocument();
  });

  test("updates input value", () => {
    const setRoomId = vi.fn();

    render(
      <RoomJoin
        roomId=""
        setRoomId={setRoomId}
        setCurrentRoom={() => {}}
        setIsHost={() => {}}
      />
    );

    const input = screen.getByPlaceholderText(
      /Enter Room ID/i
    );

    fireEvent.change(input, {
      target: { value: "abc123" },
    });

    expect(setRoomId).toHaveBeenCalled();
  });
});