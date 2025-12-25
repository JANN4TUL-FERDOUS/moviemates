import { useEffect } from "react";
import { socket } from "./socket";

function App() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to backend:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>🎬 MovieMates</h1>
      <p>Frontend socket connected</p>
    </div>
  );
}

export default App;
