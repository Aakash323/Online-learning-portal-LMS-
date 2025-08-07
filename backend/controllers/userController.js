import User from '../models/user.js';
import courseModel from '../models/course.js';
import jwt from 'jsonwebtoken';


//generating token to authenticate user
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Checking if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Creating  user
    const user = new User({ name, email, password, role });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getInstructorData = async (req, res) => {
  try {
    const instructorId = req.user._id;

    const instructor = await User.findById(instructorId).select("name email");

    // Get courses by instructor
    const courses = await courseModel.find({ instructor: instructorId });

    // Total courses
    const totalCourses = courses.length;

    // Aggregate price info (avg price, total price)
    const totalPrice = courses.reduce((acc, c) => acc + c.price, 0);
    const avgPrice = totalCourses > 0 ? totalPrice / totalCourses : 0;

    // Category count
    const categoryCount = {};
    courses.forEach((c) => {
      categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
    });

    res.json({
      instructor,
      totalCourses,
      avgPrice,
      categoryCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching dashboard data" });
  }
};