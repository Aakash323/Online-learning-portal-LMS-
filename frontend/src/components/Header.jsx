import React from 'react'

const Header = () => {
  return (
    <header
      className="relative bg-cover bg-center h-[500px] flex items-center justify-start text-left p-10 py-10"
      style={{
        backgroundImage: "url('https://skillroads.com/images/blog/college_student.jpeg')",
      }}
    >
      <div className="p-10 rounded-xl max-w-2xl"
       style={{
          backgroundColor: "rgba(255, 224, 189,0.01)", 
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-500"
        style={{ color: "#000000c1" }}
        >
          Welcome to the Learning Portal
        </h1>
        <p className="text-lg text-gray-900 mt-4">
          Explore courses, enrollments, and learn all in one place.
        </p>
        <a
          href="/courses"
          className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Browse Courses
        </a>
      </div>
    </header>
  )
}

export default Header
