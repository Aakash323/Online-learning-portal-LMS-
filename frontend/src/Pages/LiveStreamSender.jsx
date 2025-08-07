import React, { useEffect, useRef, useState } from "react";

const LiveStreamSender = () => {
  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const wsRef = useRef(null);
  const [streamTitle, setStreamTitle] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const iceCandidateQueue = useRef([]);

  useEffect(() => {
    if (!isStreaming) return;

    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        videoRef.current.srcObject = stream;

        // Create WebSocket connection
        wsRef.current = new WebSocket("ws://localhost:8080");

        pcRef.current = new RTCPeerConnection();

        stream.getTracks().forEach((track) => {
          pcRef.current.addTrack(track, stream);
        });

        // ICE candidate handling
        pcRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            wsRef.current?.send(
              JSON.stringify({ type: "candidate", candidate: event.candidate })
            );
          }
        };

        wsRef.current.onopen = async () => {
          // Register instructor with title
          wsRef.current.send(
            JSON.stringify({ type: "instructor", title: streamTitle })
          );

          // Now create and send offer
          const offer = await pcRef.current.createOffer();
          await pcRef.current.setLocalDescription(offer);

          wsRef.current.send(
            JSON.stringify({
              type: "offer",
              offer,
              title: streamTitle,
            })
          );

          console.log("Instructor offer sent with title:", streamTitle);
        };

        // Handle messages from server
        wsRef.current.onmessage = async (msg) => {
          const data = JSON.parse(msg.data);

          if (data.type === "answer") {
            await pcRef.current.setRemoteDescription(data.answer);

            // Add queued ICE candidates
            for (const candidate of iceCandidateQueue.current) {
              try {
                await pcRef.current.addIceCandidate(candidate);
              } catch (err) {
                console.error("Failed to add queued ICE candidate", err);
              }
            }
            iceCandidateQueue.current = [];
            console.log("Instructor received answer");
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
          }
        };
      } catch (err) {
        console.error("Failed to start stream", err);
      }
    };

    startStream();

    return () => {
      if (pcRef.current) pcRef.current.close();
      if (wsRef.current) wsRef.current.close();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      iceCandidateQueue.current = [];
    };
  }, [isStreaming, streamTitle]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🎥Stream Live to all students</h2>

      <input
        type="text"
        placeholder="Enter the title of your stream"
        value={streamTitle}
        onChange={(e) => setStreamTitle(e.target.value)}
        disabled={isStreaming}
        className="mb-4 p-2 border rounded w-full max-w-md"
      />

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full max-w-5xl rounded-lg border mb-4 ml-18"
      />

      {!isStreaming ? (
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setIsStreaming(true)}
          disabled={!streamTitle.trim()}
        >
          Start Stream
        </button>
      ) : (
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => setIsStreaming(false)}
        >
          Stop Stream
        </button>
      )}
    </div>
  );
};

export default LiveStreamSender;
