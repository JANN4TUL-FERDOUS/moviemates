import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Header from "../Header";

// Mock GoogleLogin component
vi.mock("@react-oauth/google", () => ({
  GoogleLogin: () => (
    <button>Google Login</button>
  ),
}));

describe("Header Component", () => {
  test("shows Google login when user not logged in", () => {
    render(
      <Header
        user={null}
        onLogin={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    expect(
      screen.getByText("Google Login")
    ).toBeInTheDocument();
  });

  test("shows user info when logged in", () => {
    render(
      <Header
        user={{
          name: "Jannat",
          avatar: "test.jpg",
        }}
        onLogin={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    expect(
      screen.getByText("Jannat")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Logout")
    ).toBeInTheDocument();
  });

  test("calls onLogout when logout clicked", () => {
    const onLogout = vi.fn();

    render(
      <Header
        user={{
          name: "Jannat",
          avatar: "test.jpg",
        }}
        onLogin={vi.fn()}
        onLogout={onLogout}
      />
    );

    fireEvent.click(
      screen.getByText("Logout")
    );

    expect(onLogout).toHaveBeenCalled();
  });
});