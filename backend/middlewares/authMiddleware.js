import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const verifyUser = async (req, res, next) => {
  // Checking if token is provided in the Authorization header
   const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.json({
      success: false,
      message: "Authorization failed! No token found",
    });
  }

  // Extracting token from the header
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, Please login first' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `'${req.user.role}' not authorized` });
    }
    next();
  };
};
