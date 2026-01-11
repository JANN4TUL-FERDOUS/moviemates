import { GoogleLogin } from "@react-oauth/google";

export default function Header({ user, onLogin, onLogout }) {
  return (
    <header className="header">
      <h2>🎬 MovieMates</h2>

      {!user ? (
        <GoogleLogin onSuccess={onLogin} />
      ) : (
        <div className="user">
          <img src={user.avatar} />
          <span>{user.name}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}
