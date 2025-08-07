# 🎓 LMS Portal – Full Stack Learning Management System

A full-featured LMS web application where **Instructors** can upload and manage courses (video/PDF)live stream, and **Students** can browse, enroll,view livestream and access protected content.

---

## 👩‍💻 Roles & Sample Accounts

| Role        | Email                    | Password   |
|-------------|--------------------------|------------|
| Instructor  | aakashpaudyal9@gmail.com | 12341234   |
| Student     | ram@gmail.com            | ram1234    |

---

## ⚙️ Features

### 🔐 Authentication
- JWT-based login & registration
- Role-based access (Instructor, Student)

###  Instructor Features
- Live streamng,Upload video and PDF content
- Manage own courses (update/delete)

### 🎓 Student Features
- Register, browse catalog
- Enroll in courses
- View video content and view PDFs

### 🌐 General
- Secure file handling with Multer 
- Protected routes for enrolled users
- Responsive React UI

### Live Demo
##### Frontend
 ```bash 
 online-learning-portal-4fonmkx37-aakash-poudels-projects.vercel.app
 ```
 ##### Backend
 ```bash 
https://online-learning-portal-lms.onrender.com/
 ```
 
## For local setup
#### 1. Clone the repo
 ```bash 
git clone https://github.com/Aakash323/Online-learning-portal-LMS-.git

```
#### 2. Backend Setup
 ```bash 
cd backend
npm install
npm run dev
```
#### 3. Frontend Setup 
 ```bash 
cd frontend
npm install
npm start
```
#### 4. Create a .env file in /backend with: 
 ```bash 
PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret

```



| Method | Endpoint                             | Description                        | Auth Required |
| ------ | ------------------------------------ | ---------------------------------- | ---------------|
| POST   | `/api/user/register`                 | Register user                      | ❌             |
| POST   | `/api/user/login`                    | Login user                         | ❌             |
| GET    | `/api/user/view-data`                | View instructor profile data       | ✅             |
| GET    | `/api/courses/fetch`                 | Show all courses                   | ❌             |
| GET    | `/api/courses/fetch/:id`             | Show specific course by ID         | ❌             |
| GET    | `/api/courses/search`                | Search courses                     | ❌             |
| POST   | `/api/courses/addCourse`             | Add a new course (Instructor only) | ✅             |
| GET    | `/api/courses/instructorCourse`      | Get courses uploaded by instructor | ✅             |
| POST   | `/api/courses/instructor/del/:id`    | Delete a course (Instructor only)  | ✅             |
| DELETE | `/api/courses/instructor/update/:id` | Update a course (Instructor only)  | ✅             |
|POST    | `/api/enrollment/en/:courseId`       |Enroll in a course                  | ✅             |
|GET     | `/api/enrollment/geten`              |Shows enrolled courses              | ✅             |
