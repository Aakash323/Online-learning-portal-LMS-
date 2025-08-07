import Enrollment from '../models/enrollment.js';
import Course from '../models/course.js';

export const enrollCourse = async (req, res) => {
  try {
    const student = req.user._id;
    const courseId= req.params.courseId

    // Checking  if course exists or not
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Checking if already enrolled in that course
    const existingEnrollment = await Enrollment.findOne({ student, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({ student, course: courseId });
    await enrollment.save();

    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during enrollment', error: err.message });
  }
};


export const getEnrolledCourses = async (req, res) => {
  try {

    const studentId = req.user._id;
    const enrollments = await Enrollment.find({ student: studentId });

    const courseIds = enrollments.map(e => e.course);

    const courses = await Course.find({ _id: { $in: courseIds } });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching enrollments' });
  }
};