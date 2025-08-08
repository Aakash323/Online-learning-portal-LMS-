import React, { useEffect, useState } from "react";
import axios from "axios";

const Visualizeddata = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("https://online-learning-portal-lms.onrender.com/api/user/view-data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(res.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (!dashboardData) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  const { instructor, totalCourses, avgPrice, categoryCount } = dashboardData;

  return (
    <div className="p-6 ml-20 md:ml-24 max-w-5xl">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Instructor Dashboard</h1>

      {/* Welcome Card */}
      <div className="mb-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Welcome, {instructor.name}</h2>
        <p className="text-gray-700 mb-1">Email: {instructor.email}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-indigo-100 p-5 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-indigo-800">Total Courses</h3>
          <p className="text-3xl font-bold text-indigo-900 mt-2">{totalCourses}</p>
        </div>

        <div className="bg-green-100 p-5 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-green-800">Average Price</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">₹{avgPrice.toFixed(2)}</p>
        </div>

        <div className="bg-yellow-100 p-5 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-yellow-800">Categories</h3>
          <p className="text-3xl font-bold text-yellow-900 mt-2">{Object.keys(categoryCount).length}</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Courses by Category</h2>
        <ul className="divide-y divide-gray-200">
          {Object.entries(categoryCount).map(([category, count]) => (
            <li key={category} className="py-2 flex justify-between text-gray-700">
              <span>{category}</span>
              <span className="font-semibold">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Visualizeddata;
