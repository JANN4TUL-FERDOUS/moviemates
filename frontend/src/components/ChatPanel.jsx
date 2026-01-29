import { useEffect, useRef } from "react";

export default function ChatPanel({
  messages,
  chatInput,
  setChatInput,
  sendMessage,
  currentUser,
  onClose,
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span>💬 Chat</span>
        <button className="chat-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => {
          const isOwnMessage = m.user.id === currentUser.id;

          return (
            <div
              key={i}
              className={`chat-message ${isOwnMessage ? "own" : "other"}`}
            >
              {!isOwnMessage && (
                <img
                  className="chat-avatar"
                  src={m.user.avatar}
                  alt={m.user.name}
                  referrerPolicy="no-referrer"
                />
              )}

              <div className="chat-bubble">
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
