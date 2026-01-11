import ChatPanel from "./ChatPanel";
import UserList from "./UserList";

export default function SidePanel({
  showChat,
  showUsers,
  users,
  messages,
  chatInput,
  setChatInput,
  sendMessage,
}) {
  return (
    <div className="side-panel">
      {showUsers && <UserList users={users} />}

      {showChat && (
        <ChatPanel
          messages={messages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          sendMessage={sendMessage}
        />
      )}
    </div>
  );
}
