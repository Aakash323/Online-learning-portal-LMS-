import axios from 'axios';
import React, { createContext,useEffect,useState,useContext } from 'react';

// Create a context for the course data
const CourseContext = createContext();
// Create a provider component


export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/courses/fetch');
      const data = await response.data;
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
}
 useEffect(() => {
    fetchCourses();
  }, []);

return (
    <CourseContext.Provider value={{ courses, setCourses, loading }}>
      {children}
    </CourseContext.Provider>
  );
}
export const useCourses = () => useContext(CourseContext);