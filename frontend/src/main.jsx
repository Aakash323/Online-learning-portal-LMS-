import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/authcontext.jsx";
import { CourseProvider } from "./context/coursecontext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CourseProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </CourseProvider>
  </BrowserRouter>
);
