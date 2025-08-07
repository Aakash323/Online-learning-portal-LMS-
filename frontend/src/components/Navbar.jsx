import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext.jsx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-gray-800">
              Learning Portal
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-36">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-700 transition duration-300"
            >
              Dashboard
            </Link>
            <Link
              to="/courses"
              className="text-gray-700 hover:text-indigo-700 transition duration-300"
            >
              Courses
            </Link>
            <Link
              to="/enroll"
              className="text-gray-700 hover:text-indigo-700 transition duration-300"
            >
              Enrollments
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3 relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-300 shadow"
                >
                  <span role="img" aria-label="user" className="text-lg">
                    👤
                  </span>
                  <span className="text-gray-700 font-semibold">
                    {user.name}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 min-w-[160px] bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                    <Link
                      to="/myenrolls"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      My enrollments
                    </Link>
                    <Link
                      to="/search"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Search
                    </Link>
                     <Link
                      to="/streams"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Live Streams
                    </Link>
                    <button
                      onClick={logout}
                      className="block px-14 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                  className="inline-flex justify-center items-center w-32 px-5 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300"
                >
                  Sign Up
                  <svg
                    className="ml-2 -mr-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {authDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                    <Link
                      to="/signup"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="block px-4 py-3 hover:bg-indigo-50 text-indigo-700 font-medium rounded-t-lg transition cursor-pointer"
                    >
                      Sign Up
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="block px-4 py-3 hover:bg-indigo-50 text-indigo-700 font-medium rounded-b-lg transition cursor-pointer"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 focus:outline-none"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <Link
            to="/dashboard"
            className="block px-4 py-2 hover:bg-gray-100 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/courses"
            className="block px-4 py-2 hover:bg-gray-100 transition"
          >
            Courses
          </Link>
          <Link
            to="/assignments"
            className="block px-4 py-2 hover:bg-gray-100 transition"
          >
            Assignments
          </Link>
          {user && (
            <>
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 transition"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
