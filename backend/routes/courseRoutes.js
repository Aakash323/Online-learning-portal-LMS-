import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  searchCourses,
  getInstructorCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { upload } from "../middlewares/multermiddleware.js";
import { authorizeRoles, verifyUser } from "../middlewares/authMiddleware.js";

const courserouter = express.Router();


courserouter.get("/fetch", getCourses);
courserouter.get("/fetch/:id", getCourseById);
courserouter.get("/search", searchCourses); 

// Protected route for instructors to upload courses & files
  courserouter.post("/addCourse",verifyUser,authorizeRoles("instructor"),upload.fields([{ name: "image", maxCount: 1 },{ name: "files", maxCount: 10 },]),createCourse);
  courserouter.get("/instructorCourse", verifyUser, authorizeRoles("instructor"),getInstructorCourses);
  courserouter.delete("/instructor/del/:id", verifyUser, authorizeRoles("instructor"), deleteCourse);
  courserouter.post('/instructor/update/:id',verifyUser, authorizeRoles("instructor"), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'files', maxCount: 10 }]),updateCourse);

export default courserouter;
