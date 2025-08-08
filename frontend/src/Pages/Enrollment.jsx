import React, { useState } from 'react';
import { useCourses } from '../context/coursecontext.jsx';
import axios from 'axios';

const Enrollment = () => {
  const { courses } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEnroll = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedCourse) {
      setError('Please select a course to enroll.');
      return;
    }

    try {
      const response = await axios.post(
        `https://online-learning-portal-lms.onrender.com/api/enrollment/en/${selectedCourse}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        }
      );

      setMessage(response.data.message || 'Successfully enrolled!');
      setSelectedCourse('');
    } catch (err) {
      console.log(err);
      
      setError(
        err.response?.data?.message || 'Failed to enroll. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Enroll in a Course</h2>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleEnroll}>
        <label htmlFor="courseSelect" className="block mb-2 font-medium">
          Select a Course:
        </label>
        <select
          id="courseSelect"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded border-gray-300"
        >
          <option value="">-- Choose a course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Enroll Now
        </button>
      </form>
    </div>
  );
};

export default Enrollment;
