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
  currentUser,
  setShowChat,
  setShowUsers,
}) {
  return (
    <div className="side-panel">
      {showUsers && ( 
        <UserList 
          users={users} 
          onClose={() => setShowUsers(false)}
        />
      )}

      {showChat && (
        <ChatPanel
          messages={messages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          sendMessage={sendMessage}
          currentUser={currentUser}
          onClose={()=> setShowChat(false)}
        />
      )}
    </div>
  );
}