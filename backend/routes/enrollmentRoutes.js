import express from 'express';
import { enrollCourse, getEnrolledCourses } from '../controllers/enrollmentController.js';
import { authorizeRoles, verifyUser } from '../middlewares/authMiddleware.js';


const enrollrouter = express.Router();

enrollrouter.post('/en/:courseId',verifyUser,authorizeRoles("student"), enrollCourse);
enrollrouter.get('/geten',verifyUser,authorizeRoles("student"),getEnrolledCourses);

export default enrollrouter;
