import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch course details
        const courseRes = await axios.get(`https://online-learning-portal-lms.onrender.com/api/courses/fetch/${id}`);
        setCourse(courseRes.data);

        // 2. Fetch user's enrollments
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const enrollmentsRes = await axios.get(`https://online-learning-portal-lms.onrender.com/api/enrollment/geten`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 3. Check if current course ID exists in enrollments
        const enrolled = enrollmentsRes.data.some((enrolledCourse) => enrolledCourse._id === id);
        setIsEnrolled(enrolled);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const response = await axios.post(
        `https://online-learning-portal-lms.onrender.com/api/enrollment/en/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert(response.data.message || "Successfully enrolled!");
      setIsEnrolled(true); 
      navigate(`/myenrolls`);
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Failed to enroll.");
    }
  };

  if (loading || !course) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading course details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {course.image && (
          <img
            src={`https://online-learning-portal-lms.onrender.com/uploads/images${course.image}`}
            alt={course.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">{course.title}</h1>
          <p className="text-gray-700 mb-4">{course.description}</p>
          <p className="text-green-600 font-semibold text-lg mb-4">₹{course.price}</p>

          {isEnrolled ? (
            <p className="text-green-700 font-semibold mb-4">
              ✅ You are already enrolled in this course.
            </p>
          ) : (
            <button
              onClick={handleEnroll}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Enroll Now
            </button>
          )}

          <div className="mt-4">
            <Link to="/courses" className="text-sm text-indigo-600 hover:underline">
              ← Back to Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
