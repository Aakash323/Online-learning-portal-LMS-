import courseModel from "../models/course.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const instructor = req.user._id;

    let image = null;
    const videos = [];
    const pdfs = [];

    if (req.files) {
      if (req.files.image && req.files.image.length > 0) {
        const imgFile = req.files.image[0];
        const imgFolder = imgFile.destination.split("/")[1];
        image = `/uploads/${imgFolder}/${imgFile.filename}`;
      }

      // Handle other files (videos, pdfs)
      if (req.files.files) {
        req.files.files.forEach((file) => {
          const folderName = file.destination.split("/")[1];
          const fileUrl = `/uploads/${folderName}/${file.filename}`;

          if (file.mimetype.startsWith("video/")) {
            videos.push({ filename: file.filename, url: fileUrl });
          } else if (file.mimetype === "application/pdf") {
            pdfs.push({ filename: file.filename, url: fileUrl });
          }
        });
      }
    }

    const course = new courseModel({
      title,
      description,
      category,
      instructor,
      price,
      image,
      videos,
      pdfs,
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating course" });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await courseModel
      .find()
      .populate("instructor", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching courses" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await courseModel
      .findById(req.params.id)
      .populate("instructor", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching course" });
  }
};

export const searchCourses = async (req, res) => {
  const { query } = req.query;

  try {
    const courses = await courseModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.json(courses);
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({ error: "Failed to search courses" });
  }
};

export const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user._id;

    const courses = await courseModel
      .find({ instructor: instructorId })
      .sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching instructor courses:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching instructor courses" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const instructorId = req.user._id;

    const course = await courseModel.findOne({
      _id: courseId,
      instructor: instructorId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or unauthorized" });
    }

    await courseModel.deleteOne({ _id: courseId });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error deleting course" });
  }
};


export const updateCourse = async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  try {
    const courseId = req.params.id;
    const instructorId = req.user._id;

    const course = await courseModel.findOne({
      _id: courseId,
      instructor: instructorId,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const {
      title,
      description,
      category,
      price,
    } = req.body;

    // Parse arrays from JSON strings
    const removeVideos = req.body.removeVideos ? JSON.parse(req.body.removeVideos) : [];
    const removePdfs = req.body.removePdfs ? JSON.parse(req.body.removePdfs) : [];

    // Update course fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (price !== undefined) course.price = price;

    // Handle new uploads
    if (req.files) {
      if (req.files.image && req.files.image.length > 0) {
        
        const newImage = req.files.image[0];
        const imgPath = `/uploads/images/${newImage.filename}`;

        // Delete old image if exists
        if (course.image) {
          const oldPath = path.join(__dirname, "..", course.image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        course.image = imgPath;
      }

      if (req.files.files && req.files.files.length > 0) {
        req.files.files.forEach((file) => {
          let fileUrl = "";
          if (file.mimetype.startsWith("video/")) {
            fileUrl = `/uploads/videos/${file.filename}`;
            course.videos.push({ filename: file.filename, url: fileUrl });
          } else if (file.mimetype === "application/pdf") {
            fileUrl = `/uploads/pdfs/${file.filename}`;
            course.pdfs.push({ filename: file.filename, url: fileUrl });
          }
        });
      }
    }

    // Remove videos
    if (Array.isArray(removeVideos) && removeVideos.length > 0) {
      course.videos = course.videos.filter((video) => {
        const toDelete = removeVideos.includes(video.filename);
        if (toDelete) {
          const videoPath = path.join(__dirname, "..", video.url);
          if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
        }
        return !toDelete;
      });
    }

    // Remove PDFs
    if (Array.isArray(removePdfs) && removePdfs.length > 0) {
      course.pdfs = course.pdfs.filter((pdf) => {
        const toDelete = removePdfs.includes(pdf.filename);
        if (toDelete) {
          const pdfPath = path.join(__dirname, "..", pdf.url);
          if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
        }
        return !toDelete;
      });
    }

    await course.save();
    res.json(course);
  } catch (error) {
    console.error("Course update failed:", error);
    res.status(500).json({ message: "Server error updating course" });
  }
};




