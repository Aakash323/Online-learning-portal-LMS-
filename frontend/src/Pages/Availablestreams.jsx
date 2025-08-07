import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AvailableStreams = () => {
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "student-check" }));
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "offer") {
        setStream({ title: data.title });
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🎓 Available Streams</h2>
      {stream ? (
        <div className="mb-4">
          <p>🎥 <strong>{stream.title}</strong></p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            onClick={() => navigate("/viewer")}
          >
            Watch Stream
          </button>
        </div>
      ) : (
        <p>No active livestreams right now.</p>
      )}
    </div>
  );
};

export default AvailableStreams;
