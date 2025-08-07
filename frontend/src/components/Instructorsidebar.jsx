import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authcontext";


const IconDashboard = () => <span className="text-xl">🏠</span>;
const IconCreate = () => <span className="text-xl">➕</span>;
const IconCourses = () => <span className="text-xl">📚</span>;
const IconStream = () => <span className="text-xl">🎥</span>;
const IconLogout = () => <span className="text-xl">🚪</span>;
const IconMenu = () => <span className="text-xl">☰</span>;
const IconClose = () => <span className="text-xl">☰</span>;


const InstructorSidebar = () => {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);

  if (!user || user.role !== "instructor") return null;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out shadow-md
          ${expanded ? "w-50" : "w-18"} flex flex-col fixed top-0 left-0 z-40`}
      >
        <div className="flex items-center justify-between p-4 border-b border-indigo-500">
          <span className="text-lg font-bold">
            {expanded ? `Hi, ${user.name.split(" ")[0]}` : ""}
          </span>
          <button onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? <IconClose /> : <IconMenu />}
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-4 text-sm">
          <SidebarLink to="/instructor/" icon={<IconDashboard />} label="Dashboard" expanded={expanded} />
          <SidebarLink to="/instructor/create-course" icon={<IconCreate />} label="Create Course" expanded={expanded} />
          <SidebarLink to="/instructor/my-courses" icon={<IconCourses />} label="My Courses" expanded={expanded} />
         <SidebarLink to="/instructor/streamsender" icon={<IconStream />} label="Stream Live" expanded={expanded} />

          <button
            onClick={logout}
            className="flex items-center gap-3 mt-auto text-left hover:bg-red-600 rounded p-2 transition"
          >
            <IconLogout />
            {expanded && <span>Logout</span>}
          </button>
        </nav>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, label, expanded }) => (
  <Link
    to={to}
    className="flex items-center gap-3 p-2 rounded hover:bg-indigo-600 transition whitespace-nowrap"
  >
    {icon}
    {expanded && <span>{label}</span>}
  </Link>
);

export default InstructorSidebar;
