import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";
import { connectDB } from './config/dbconfig.js';
import courserouter from './routes/courseRoutes.js';
import Userrouter from './routes/userRoutes.js';
import enrollrouter from './routes/enrollmentRoutes.js';
import cors from 'cors';
dotenv.config();



const app = express();
const port = process.env.PORT || 3000;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

connectDB()

app.get('/', (req,res)=>{
    res.send("api is working")
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
app.use('/api/courses',courserouter);
app.use('/api/user',Userrouter)
app.use('/api/enrollment',enrollrouter);

app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`);
    
})