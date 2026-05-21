import { render, screen, fireEvent } from "@testing-library/react";
import ChatPanel from "../ChatPanel";
import { vi } from "vitest";

vi.mock("../../socket", () => ({
  socket: {
    emit: vi.fn(),
  },
}));

describe("ChatPanel Component", () => {
  const props = {
    messages: [
      {
        _id: "1",
        text: "Hello",
        timestamp: new Date(),
        user: {
          id: "u1",
          name: "John",
          avatar: "avatar.png",
        },
      },
    ],

    chatInput: "",
    setChatInput: vi.fn(),
    sendMessage: vi.fn(),

    currentUser: {
      id: "u1",
      name: "John",
    },

    onClose: vi.fn(),

    replyMessage: null,
    setReplyMessage: vi.fn(),
  };

  test("renders messages", () => {
    render(<ChatPanel {...props} />);

    expect(
      screen.getByText("Hello")
    ).toBeInTheDocument();
  });

  test("calls sendMessage on button click", () => {
    render(<ChatPanel {...props} />);

    const sendBtn = screen.getByText(/Send/i);

    fireEvent.click(sendBtn);

    expect(props.sendMessage).toHaveBeenCalled();
  });

  test("updates input field", () => {
    render(<ChatPanel {...props} />);

    const input = screen.getByPlaceholderText(
      /Type a message/i
    );

    fireEvent.change(input, {
      target: { value: "Hi" },
    });

    expect(props.setChatInput).toHaveBeenCalled();
  });

  test("shows reply preview", () => {
    render(
      <ChatPanel
        {...props}
        replyMessage={{
          text: "Reply Message",
          user: {
            id: "u2",
            name: "Alice",
          },
        }}
      />
    );

    expect(
      screen.getByText("Reply Message")
    ).toBeInTheDocument();
  });
});