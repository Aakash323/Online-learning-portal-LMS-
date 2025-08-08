import React from "react";
import { useCourses } from "../context/coursecontext.jsx";

const CourseSection = () => {
  const { courses, loading } = useCourses();

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl font-semibold text-gray-600">
        Loading courses...
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center mt-10 text-xl font-semibold text-gray-800">
        No courses available.
      </div>
    );
  }

  // Get up to 3 courses to preview
  const previewCourses = courses.slice(0, 3);

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Courses</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewCourses.map((course) => (
            <div
              key={course._id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {course.image && (
                <img
                  src={`https://online-learning-portal-lms.onrender.com${course.image}`} 
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{course.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-right">
          <a href="/courses" className="text-indigo-600 hover:underline font-medium">
            View All Courses →
          </a>
        </div>
      </div>
    </section>
  );
};

export default CourseSection;
