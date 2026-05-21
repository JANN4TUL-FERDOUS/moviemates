import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import UserList from "../UserList";

describe("UserList Component", () => {
  const users = [
    {
      id: "1",
      name: "Jannat",
      avatar: "avatar1.jpg",
      isHost: false,
    },
    {
      id: "2",
      name: "Rahim",
      avatar: "avatar2.jpg",
      isHost: true,
    },
  ];

  test("shows current user with You label", () => {
    render(
      <UserList
        users={users}
        currentUser={{ id: "1" }}
        onClose={vi.fn()}
      />
    );

    expect(
      screen.getByText(/Jannat/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/\(You\)/)
    ).toBeInTheDocument();
  });

  test("shows host label", () => {
    render(
      <UserList
        users={users}
        currentUser={{ id: "1" }}
        onClose={vi.fn()}
      />
    );

    expect(
      screen.getByText(/\(Host\)/)
    ).toBeInTheDocument();
  });

  test("calls onClose when close button clicked", () => {
    const onClose = vi.fn();

    render(
      <UserList
        users={users}
        currentUser={{ id: "1" }}
        onClose={onClose}
      />
    );

    const closeButton =
      screen.getByText("✕");

    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });
});