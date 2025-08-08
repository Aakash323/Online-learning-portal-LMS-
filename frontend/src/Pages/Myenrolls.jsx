import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Myenrolls = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "https://online-learning-portal-lms.onrender.com/api/enrollment/geten", 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch enrolled courses");
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading courses...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">{error}</div>
    );

  if (courses.length === 0)
    return (
      <div className="text-center mt-20 text-gray-600 font-semibold">
        You are not enrolled in any courses yet.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-indigo-700 text-center">
          My Enrolled Courses
        </h1>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={`https://online-learning-portal-lms.onrender.com/${course.image}`}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h2 className="text-2xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-700 mb-4 line-clamp-3">{course.description}</p>
                <p className="font-semibold text-green-600 mb-4">Price: ₹{course.price}</p>
                <Link
                  to={`/course-content/${course._id}`} // this route should show videos & PDFs
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  View Course Content
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Myenrolls;
