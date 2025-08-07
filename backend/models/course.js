import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, trim: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    image: { type: String, required: false, trim: true },
    videos: [{ filename: String, url: String }],
    pdfs: [{ filename: String, url: String }],
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const courseModel = mongoose.model("Course", courseSchema);
export default courseModel;

// The course model represents the courses available in the system.
// It includes fields for title, description, category, instructor, videos, PDFs, and price.
// The 'instructor' field references the User model to associate a course with its creator. 
// The 'videos' and 'pdfs' fields are arrays that can store multiple files related to the course.