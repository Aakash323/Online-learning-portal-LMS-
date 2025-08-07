import React, { useEffect, useRef, useState } from "react";

const LiveStreamViewer = () => {
  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const wsRef = useRef(null);
  const [streamTitle, setStreamTitle] = useState("");
  const [isWatching, setIsWatching] = useState(false);
  const [status, setStatus] = useState("No stream currently active");

  const iceCandidateQueue = useRef([]);

  useEffect(() => {
    if (!isWatching) {
      setStatus("No stream currently active");
      setStreamTitle("");

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }

      iceCandidateQueue.current = [];
      return;
    }

    const startViewing = async () => {
      wsRef.current = new WebSocket("ws://localhost:8080");

      pcRef.current = new RTCPeerConnection();

      pcRef.current.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
        setStatus("Stream is live!");
      };

      pcRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          wsRef.current.send(
            JSON.stringify({ type: "candidate", candidate: event.candidate })
          );
        }
      };

      wsRef.current.onopen = () => {
        wsRef.current.send(JSON.stringify({ type: "student" }));
        console.log("Student connected to signaling server");
      };

      wsRef.current.onmessage = async (msg) => {
        const data = JSON.parse(msg.data);
        console.log("Student received:", data);

        if (data.type === "offer") {
          if (data.title) {
            setStreamTitle(data.title);
          }

          await pcRef.current.setRemoteDescription(data.offer);
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);

          wsRef.current.send(
            JSON.stringify({ type: "answer", answer: pcRef.current.localDescription })
          );

          for (const candidate of iceCandidateQueue.current) {
            try {
              await pcRef.current.addIceCandidate(candidate);
            } catch (err) {
              console.error("Failed to add queued ICE candidate", err);
            }
          }

          iceCandidateQueue.current = [];
          setStatus("Connected to stream");

        } else if (data.type === "candidate") {
          if (pcRef.current.remoteDescription) {
            try {
              await pcRef.current.addIceCandidate(data.candidate);
            } catch (err) {
              console.error("Failed to add ICE candidate", err);
            }
          } else {
            iceCandidateQueue.current.push(data.candidate);
          }

        } else if (data.type === "no-stream") {
          setStatus("No stream currently active");
          setStreamTitle("");
          if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
          }
        }
      };
    };

    startViewing();
  }, [isWatching]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">👀 Student View</h2>
      <p className="text-gray-700 mb-1">
        <strong>Stream title:</strong> {streamTitle || "N/A"}
      </p>
      <p className="text-sm text-gray-600 mb-4">{status}</p>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-2xl rounded-lg border mb-4"
      />

      {!isWatching ? (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setIsWatching(true)}
        >
          ▶️ View Stream
        </button>
      ) : (
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => setIsWatching(false)}
        >
          ⏹ Stop Watching
        </button>
      )}
    </div>
  );
};

export default LiveStreamViewer;
