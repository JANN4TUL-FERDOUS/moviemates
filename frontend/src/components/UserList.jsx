export default function UserList({ users, currentUser, onClose }) {
  
  const currentUserData = users.find(u => u.id === currentUser?.id);
  const otherUsers = users.filter(u => u.id !== currentUser?.id);
  
  const sortedUsers = [...otherUsers].sort(
    (a, b) => (b.isHost === true) - (a.isHost === true)
  );
  
  return (
    <div className="users-panel">
      <div className="users-header">
        <span>👥 Users</span>
        <button className="users-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <ul className="user-list">
        {currentUserData && (
          <li key={currentUserData.id} className="user-item">
            <img src={currentUserData.avatar} alt={currentUserData.name} />
            <span>
              {currentUserData.name}
              {currentUserData.isHost ? " (Host)" : " (You)"}
            </span>
          </li>
        )}
        
        {sortedUsers.map((u) => (
          <li key={u.id} className="user-item">
            <img src={u.avatar} alt={u.name} />
            <span>
              {u.name}
              {u.isHost && " (Host)"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
