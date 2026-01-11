export default function UserList({ users }) {
  return (
    <>
      <h3>👥 Users</h3>
      <ul className="user-list">
        {users.map((u) => (
          <li key={u.id}>
            <img src={u.avatar} />
            {u.name}
          </li>
        ))}
      </ul>
    </>
  );
}
