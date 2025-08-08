import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signuppage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [errors, setErrors] = useState({});
  const [confirmPasswordvalue, setConfirmPasswordValue] = useState("");
  const navigate = useNavigate();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const tempErrors = {};

    if (!data.name.trim() || data.name.length < 3) {
      tempErrors.name = "Name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim() || !emailRegex.test(data.email)) {
      tempErrors.email = "Enter a valid email address";
    }

    if (data.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (data.password !== confirmPasswordvalue) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await axios.post("https://online-learning-portal-lms.onrender.com/api/user/register", data);
        alert("Registration successful! Please log in.");
        navigate("/login");
      } catch (error) {
        console.error("Signup Error:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Signup failed!");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6"
      style={{
        background: "linear-gradient(135deg, #b4b3b3 0%, #5584bb 100%)",
      }}
    >
      <div
        className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-30 p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={data.name}
              onChange={changeHandler}
              className="w-full px-4 py-3 rounded-md border bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={changeHandler}
              className="w-full px-4 py-3 rounded-md border bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={changeHandler}
              className="w-full px-4 py-3 rounded-md border bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPasswordvalue}
              onChange={(e) => setConfirmPasswordValue(e.target.value)}
              className="w-full px-4 py-3 rounded-md border bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Role Radio Buttons */}
          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 text-gray-900">
              <input
                type="radio"
                name="role"
                value="student"
                checked={data.role === "student"}
                onChange={changeHandler}
                className="text-indigo-600"
              />
              Student
            </label>
            <label className="flex items-center gap-2 text-gray-900">
              <input
                type="radio"
                name="role"
                value="instructor"
                checked={data.role === "instructor"}
                onChange={changeHandler}
                className="text-indigo-600"
              />
              Instructor
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md transition duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signuppage;
