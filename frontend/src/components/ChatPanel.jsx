export default function ChatPanel({
  messages,
  chatInput,
  setChatInput,
  sendMessage,
}) {
  return (
    <>
      <h3>💬 Chat</h3>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.user.name}:</strong>{" "}
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={chatInput}
          onChange={(e) =>
            setChatInput(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </>
  );
}
