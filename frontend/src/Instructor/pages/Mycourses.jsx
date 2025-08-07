import React from "react";
import InstructorCourseList from "../../components/InstructorCourseList";

const MyCoursesPage = () => {
  return (
    <div className="w-full ml-10 mr-14">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">My Courses</h1>
      <p className="text-gray-600 mb-6">Here are all the courses you've created.</p>
      <InstructorCourseList />
    </div>
  );
};

export default MyCoursesPage;
