import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { socket } from "../socket";

export default function ChatPanel({
  messages,
  chatInput,
  setChatInput,
  sendMessage,
  currentUser,
  onClose,
  replyMessage,
  setReplyMessage,
}) {
  const messagesEndRef = useRef(null);
  const [activeMsg, setActiveMsg] = useState(null);
  const [showEmojiFor, setShowEmojiFor] = useState(null);

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
                <div className="msg-options">
                  <button
                    onClick={() =>
                      setActiveMsg(activeMsg === i ? null : i)
                    }
                  >
                    ⋮
                  </button>

                  {activeMsg === i && (
                    <div className="msg-menu">
                      <div onClick={() => {
                        setReplyMessage(m);
                        setActiveMsg(null);
                      }}>
                        Reply
                      </div>

                      <div onClick={() => {
                        setShowEmojiFor(i);
                      }}>
                        React
                      </div>
                    </div>
                  )}

                  {showEmojiFor === i && (
                    <div 
                      className="emoji-picker"
                      onClick={(e) => e.stopPropagation()}
                    >

                      <EmojiPicker
                        onEmojiClick={(emojiData, event) => {
                          event.stopPropagation(); 
                          
                          socket.emit("chat:react", {
                            messageId: m._id,
                            emoji: emojiData.emoji,
                            userId: currentUser.id,
                          });

                          setShowEmojiFor(null);
                          setActiveMsg(null);
                        }}
                      />
                    </div>
                  )}
                </div>

                {m.replyTo && (
                  <div className="wa-reply-box">
                    <strong>
                      {m.replyTo.user?.id === currentUser.id
                        ? "You"
                        : m.replyTo.user?.name}
                    </strong>
                    <span>{m.replyTo.text}</span>
                  </div>
                )}
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

              {m.reactions && m.reactions.length > 0 && (() => {
                const grouped = {};

                m.reactions.forEach((r) => {
                  if (!grouped[r.emoji]) {
                    grouped[r.emoji] = 0;
                  }
                  grouped[r.emoji]++;
                });

                return (
                  <div className="reactions">
                    {Object.entries(grouped).map(([emoji, count]) => (
                      <span key={emoji} className="reaction-item">
                        {emoji} {count}
                      </span>
                    ))}
                  </div>
                );
              })()}

            </div>
          );
        })}

        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        {replyMessage && (
          <div className="wa-reply-preview">
            <div className="wa-reply-text">
              <strong>
                {replyMessage.user.id === currentUser.id
                  ? "You"
                  : replyMessage.user.name}
              </strong>
              <span>{replyMessage.text}</span>
            </div>

            <button onClick={() => setReplyMessage(null)}>✕</button>
          </div>
        )}

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
