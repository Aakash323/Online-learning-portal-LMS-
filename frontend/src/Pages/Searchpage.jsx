import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../components/Coursecard.jsx";


const Searchpage = () => {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("https://online-learning-portal-lms.onrender.com//api/courses/fetch");
        setCourses(res.data);
        setFilteredCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [query, courses]);

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Search Courses</h1>
      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by course title..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => <CourseCard key={course._id} course={course} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full">No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default Searchpage;
