import { useEffect, useRef } from "react";

export default function ChatPanel({
  messages,
  chatInput,
  setChatInput,
  sendMessage,
  currentUser,
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-panel">
      <div className="chat-header">💬 Chat</div>

      <div className="chat-messages">
        {messages.map((m, i) => {
          const isOwnMessage = m.user.id === currentUser.id;

          return (
            <div
              key={i}
              className={`chat-message ${isOwnMessage ? "own" : "other"}`}
            >
              {/* Avatar only for other users */}
              {!isOwnMessage && (
                <img
                  className="chat-avatar"
                  src={m.user.avatar}
                  alt={m.user.name}
                  referrerPolicy="no-referrer"
                />
              )}

              <div className="chat-bubble">
                {/* Username only for other users */}
                {!isOwnMessage && (
                  <div className="chat-name">{m.user.name}</div>
                )}

                <div className="chat-text">{m.text}</div>

                <div className="chat-time">
                  {new Date(m.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
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
