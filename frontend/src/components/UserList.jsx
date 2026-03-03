export default function UserList({ users, onClose }) {
  
  const sortedUsers = [...users].sort(
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
