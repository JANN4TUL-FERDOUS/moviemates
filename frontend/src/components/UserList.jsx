export default function UserList({ users, onClose }) {
  return (
    <div className="users-panel">
      <div className="users-header">
        <span>👥 Users</span>
        <button className="users-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <ul className="user-list">
        {users.map((u) => (
          <li key={u.id} className="user-item">
            <img src={u.avatar} alt={u.name} />
            <span>{u.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
