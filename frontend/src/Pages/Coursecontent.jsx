import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CourseContent = () => {
  const { id } = useParams(); // courseId from URL
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseContent = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`https://online-learning-portal-lms.onrender.com//api/courses/fetch/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourse(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("You are not enrolled in this course.");
        } else {
          setError("Failed to load course content.");
        }
      }
    };

    fetchCourseContent();
  }, [id, navigate]);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600 font-semibold text-lg">
        <p>{error}</p>
        <Link
          to="/courses"
          className="mt-4 text-indigo-600 hover:underline text-sm"
        >
          ← Back to Courses
        </Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading course content...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={`https://online-learning-portal-lms.onrender.com/${course.image}`}
          alt={course.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">
            {course.title}
          </h1>
          <p className="text-gray-700 mb-6">{course.description}</p>

          {/* Videos */}
          {course.videos?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Course Videos:
              </h3>
              <div className="space-y-6">
                {course.videos.map((video, index) => (
                  <div key={index}>
                    <video
                      controls
                      className="w-full rounded shadow"
                      src={`https://online-learning-portal-lms.onrender.com/${video.url}`}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <p className="text-sm text-gray-600 mt-1">{video.filename}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PDFs */}
          {course.pdfs?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Downloadable PDFs:
              </h3>
              <div className="space-y-3">
                {course.pdfs.map((pdf, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded">
                    <span className="text-gray-700">{pdf.filename}</span>
                    <a
                      href={`https://online-learning-portal-lms.onrender.com/${pdf.url}`}
                      download
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Link
              to="/courses"
              className="text-sm text-indigo-600 hover:underline"
            >
              ← Back to My Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
