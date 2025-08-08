import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
      {course.image && (
        <img
          src={`https://online-learning-portal-lms.onrender.com/${course.image}`}
          alt={course.title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
        <p className="text-green-600 font-bold mb-3">₹{course.price}</p>
        <Link
          to={`/coursesinfo/${course._id}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
