import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let instructor = null;
let instructorTitle = "";
let instructorOffer = null;

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      console.error("Invalid JSON", err);
      return;
    }

    switch (data.type) {
      case "instructor":
        instructor = ws;
        instructorTitle = data.title || "";
        console.log("Registered instructor with title:", instructorTitle);
        break;

      case "offer":
        if (ws === instructor) {
          instructorOffer = data.offer; // Save the offer
          console.log("Received offer from instructor");

          // Send to all students
          wss.clients.forEach((client) => {
            if (client !== instructor && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "offer",
                offer: instructorOffer,
                title: instructorTitle,
              }));
            }
          });
        }
        break;

      case "student":
        console.log("Student registered");
        if (instructor && instructorOffer && instructor.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: "offer",
            offer: instructorOffer,
            title: instructorTitle,
          }));
          console.log("Sent existing offer to student");
        } else {
          ws.send(JSON.stringify({ type: "no-stream" }));
          console.log("No stream available for student");
        }
        break;

      case "answer":
        if (instructor && instructor.readyState === WebSocket.OPEN) {
          instructor.send(JSON.stringify({
            type: "answer",
            answer: data.answer,
          }));
        }
        break;

      case "candidate":
        if (ws === instructor) {
          // Forward instructor's ICE candidates to all students
          wss.clients.forEach((client) => {
            if (client !== instructor && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "candidate",
                candidate: data.candidate,
              }));
            }
          });
        } else if (instructor && instructor.readyState === WebSocket.OPEN) {
          // Forward student's ICE candidate to instructor
          instructor.send(JSON.stringify({
            type: "candidate",
            candidate: data.candidate,
          }));
        }
        break;

      default:
        console.warn("Unknown message type:", data.type);
        break;
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");

    if (ws === instructor) {
      console.log("Instructor disconnected");
      instructor = null;
      instructorTitle = "";
      instructorOffer = null;

      // Notify all students there's no active stream
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "no-stream" }));
        }
      });
    }
  });
});
