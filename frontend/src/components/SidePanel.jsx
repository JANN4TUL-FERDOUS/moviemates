import ChatPanel from "./ChatPanel";
import UserList from "./UserList";

export default function SidePanel({
  showChat,
  showUsers,
  users,
  hostId,
  messages,
  chatInput,
  setChatInput,
  sendMessage,
}) {
  return (
    <div className="side-panel">
      {showUsers && <UserList users={users} hostId={hostId} />}

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
