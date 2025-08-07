import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authcontext";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const {login} = useAuth();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:3000/api/user/login", { email, password });
    console.log("Login successful:", response.data);
    alert("Login successful!");
    localStorage.setItem("token", response.data.token);

    const user = response.data.user;
    login(user); 

    // Redirect based on role
    if (user.role === "instructor") {
      navigate("/instructor");
    } else {
      navigate("/");
    }

  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Login failed!");
  }
};

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #b4b3b3ff 0%, #5584bbff 100%)",
      }}
    >
      <div
        className="max-w-md w-full p-8 rounded-lg shadow-lg border border-white border-opacity-30"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)", 
          backdropFilter: "blur(12px)", 
          WebkitBackdropFilter: "blur(12px)", 
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-3 border rounded-md bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 border rounded-md bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Loginpage;
