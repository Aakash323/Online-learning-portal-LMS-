import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const InstructorCourseList = () => {
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://online-learning-portal-lms.onrender.com//api/courses/instructorCourse", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allCourses = res.data;
        setCourses(allCourses);
      } catch (error) {
        console.error("Failed to fetch instructor courses", error);
      }
    };

    fetchCourses();
  }, [token]);

  if (courses.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-600">
        <p className="mb-4 text-lg">You haven’t created any courses yet.</p>
        <Link
          to="/instructor/create-course"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
        >
          Start by Creating a Course
        </Link>
      </div>
    );
  }

 return (
  <div className="w-full">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Courses</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-white shadow-md rounded">
      {courses.map((course) => (
        <div
          key={course._id}
          className="bg-white rounded shadow p-4 hover:shadow-md transition"
        >
          {course.image && (
            <img
              src={`https://online-learning-portal-lms.onrender.com/${course.image}`}
              alt={course.title}
              className="w-full h-40 object-cover rounded mb-3"
            />
          )}
          <h3 className="text-xl font-bold text-indigo-700 mb-1">{course.title}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
          <p className="text-green-600 font-semibold mb-2">₹{course.price}</p>
          <Link
            to={`/instructor/edit/${course._id}`}
            className="text-sm text-blue-600 hover:underline mb--1"
          >
            View Details →
          </Link>
        </div>
      ))}
    </div>
  </div>
);

};

export default InstructorCourseList;
