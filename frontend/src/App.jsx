import { useState } from 'react'
import './App.css'
import { Routes, Route,Navigate } from "react-router-dom";
import Navbar from './components/Navbar.jsx'
import { useAuth } from './context/authcontext.jsx';

import Coursepage from './Pages/Coursepage.jsx';
import CourseDetail from './Pages/Coursedetail.jsx';
import Mainlayout from './Layouts/Mainlayout.jsx'
import Dashboard from './Pages/Dashboard.jsx';
import Enrollment from './Pages/Enrollment.jsx';
import Signup from './Pages/Signuppage.jsx';
import Loginpage from './Pages/Loginpage.jsx';
import Myenrolls from './Pages/Myenrolls.jsx';
import CourseContent from './Pages/Coursecontent.jsx';
import Searchpage from './Pages/Searchpage.jsx';
import Instructordashboard from './Instructor/pages/Instructordashboard.jsx';
import CreateCourse from './Instructor/pages/Createcourse.jsx';

import MyCoursesPage from './Instructor/pages/Mycourses.jsx';
import InstructorLayout from './Layouts/Instructorlayout.jsx';
import Editcourse from './Instructor/pages/Editcourse.jsx';
import Unauthorized from './Layouts/Unauthorized.jsx';
import ProtectedRoute from './components/Protectedroute.jsx';
import LiveStreamSender from './Pages/Livestreamsender.jsx';
import LiveStreamViewer from './Pages/LiveStreamViewer.jsx';
import AvailableStreams from './Pages/Availablestreams.jsx';

function App() {
  const {user} = useAuth();
  console.log(user);
  
  const isInstructor = user && user.role === "instructor";
  const isLoggedIn = !!user;
  const isStudent = user && user.role === "student";
  
  

  return (
    <>
   <Routes>
  {/* Main Layout Routes */}
  <Route element={<Mainlayout />}>
    <Route path="/" element={<Dashboard />} />
    <Route path="/courses" element={<Coursepage />} />
    <Route path="/enroll" element={<Enrollment />} />
    <Route path="/coursesinfo/:id" element={<CourseDetail />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Loginpage />} /> 
    <Route path="/search" element={<Searchpage />} />
 
  

  {/* Protected User Routes */}
    <Route path="/myenrolls" element={ <ProtectedRoute role="student"><Myenrolls /></ProtectedRoute>} />
  <Route path="/course-content/:id" element={ <ProtectedRoute role="student"><CourseContent /></ProtectedRoute>}/>
     <Route path="/viewer" element={<ProtectedRoute role ="student"><LiveStreamViewer /></ProtectedRoute>} />
    <Route path='/streams' element={<ProtectedRoute role ="student"><AvailableStreams /></ProtectedRoute>}/>
</Route>
  {/* Protected Instructor Routes */}
  <Route
    path="/instructor"
    element={
      isLoggedIn && isInstructor ? (
        <InstructorLayout />
      ) : !isLoggedIn ? (
        <Navigate to="/login" replace />
      ) : (
        <Navigate to="*"/>
      )
    }
  >
    <Route index element={<Instructordashboard />} />
    <Route path="create-course" element={<CreateCourse />} />
    <Route path="streamsender" element={<LiveStreamSender />} />
    <Route path="my-courses" element={<MyCoursesPage />} />
    <Route path="edit/:id" element={<Editcourse />} />
  </Route>

  <Route
    path="/unauthorized"
    element={<Unauthorized />}
  />

  {/* Catch-all route for unauthorized access */}
  <Route path="*" element={<Navigate to="/unauthorized" />} />
</Routes>
    </>
  )
}

export default App
