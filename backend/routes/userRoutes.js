import express from 'express';
import { getInstructorData, loginUser, registerUser } from '../controllers/userController.js';
import { authorizeRoles, verifyUser } from '../middlewares/authMiddleware.js';

const Userrouter = express.Router();

Userrouter.post('/register', registerUser);
Userrouter.post('/login', loginUser);
Userrouter.get('/view-data',verifyUser,authorizeRoles("instructor"),getInstructorData)

export default Userrouter;
