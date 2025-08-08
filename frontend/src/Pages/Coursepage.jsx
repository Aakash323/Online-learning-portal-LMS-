import React from "react";
import { Link } from "react-router-dom";
import { useCourses } from "../context/coursecontext.jsx";

const Coursepage = () => {
  const { courses, loading } = useCourses();
  if (loading) {
    return <div className="text-center py-10">Loading courses...</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-10">
        No courses available at the moment.
      </div>
    );
  }

  return (
    <main className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">All Courses</h1>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {courses.map((course) => (
            <Link to={`/coursesinfo/${course._id}`}>
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={`https://online-learning-portal-lms.onrender.com/${course.image}`}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{course.title}</h2>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Coursepage;
