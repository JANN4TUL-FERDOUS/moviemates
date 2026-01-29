export default function ChatPanel({
  messages,
  chatInput,
  setChatInput,
  sendMessage,
}) {
  return (
    <div className="chat-panel">
      <div className="chat-header">💬 Chat</div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div className="chat-message" key={i}>
            <img
              className="chat-avatar"
              src={m.user.avatar}
              alt={m.user.name}
              referrerPolicy="no-referrer"
            />

            <div className="chat-bubble">
              <div className="chat-name">
                {m.user.name}
              </div>

              <div className="chat-text">
                {m.text}
              </div>

              <div className="chat-time">
                {new Date(m.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
