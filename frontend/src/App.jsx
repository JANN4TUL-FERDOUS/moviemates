import { useEffect, useState } from "react";
import { socket } from "./socket";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    return () => socket.disconnect();
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    const userData = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      avatar: decoded.picture,
    };

    setUser(userData);
    console.log("Logged in user:", userData);

    socket.emit("user:login", userData);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎬 MovieMates</h1>

      {!user ? (
        <GoogleLogin onSuccess={handleLoginSuccess} />
      ) : (
        <div>
          <img src={user.avatar} alt="avatar" width={60} />
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}
    </div>
  );
}

export default App;
