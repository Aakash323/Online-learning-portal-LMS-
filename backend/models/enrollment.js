import mongoose from 'mongoose';

// Enrollment schema definition
// This schema represents the relationship between students and courses they are enrolled in.
// It includes references to the User and Course models, along with the enrollment date.
// The 'student' field references the User model, while the 'course' field references the Course model.
// The 'enrolledAt' field records the date and time when the student enrolled in the course.

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const enrollmentModel = mongoose.model("Enrollment", enrollmentSchema);
export default enrollmentModel;