import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Editcourse = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  // New files to add
  const [newVideos, setNewVideos] = useState([]);
  const [newPdfs, setNewPdfs] = useState([]);

  // Existing files user can remove
  const [existingVideos, setExistingVideos] = useState([]);
  const [existingPdfs, setExistingPdfs] = useState([]);

  const [isUploading, setIsUploading] = useState(false); // <-- Loading state

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          "https://online-learning-portal-lms.onrender.com/api/courses/instructorCourse",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourses(res.data);
      } catch (error) {
        console.error("Failed to fetch instructor courses", error);
      }
    };

    fetchCourses();
  }, [token]);

  const startEditing = (course) => {
    setEditingCourseId(course._id);
    setEditFormData({ ...course });
    setThumbnail(null);
    setNewVideos([]);
    setNewPdfs([]);
    setExistingVideos(course.videos ? [...course.videos] : []);
    setExistingPdfs(course.pdfs ? [...course.pdfs] : []);
  };

  const cancelEditing = () => {
    setEditingCourseId(null);
    setEditFormData(null);
    setThumbnail(null);
    setNewVideos([]);
    setNewPdfs([]);
    setExistingVideos([]);
    setExistingPdfs([]);
    setIsUploading(false);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(
        `https://online-learning-portal-lms.onrender.com/api/courses/instructor/del/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCourses((prev) => prev.filter((course) => course._id !== courseId));
      if (editingCourseId === courseId) cancelEditing();
    } catch (error) {
      console.error("Failed to delete course", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUploading(true); // Start loading

    try {
      const formData = new FormData();
      formData.append("title", editFormData.title);
      formData.append("description", editFormData.description);
      formData.append("category", editFormData.category);
      formData.append("price", editFormData.price);

      if (thumbnail) formData.append("image", thumbnail);

      // Existing files to keep as JSON strings
      formData.append("existingVideos", JSON.stringify(existingVideos));
      formData.append("existingPdfs", JSON.stringify(existingPdfs));

      // Append new videos
      newVideos.forEach((file) => formData.append("files", file));

      // Append new PDFs
      newPdfs.forEach((file) => formData.append("files", file));

      // Calculate which original files to remove
      const originalCourse = courses.find((c) => c._id === editingCourseId);
      const originalVideos = originalCourse?.videos || [];
      const originalPdfs = originalCourse?.pdfs || [];

      const removeVideos = originalVideos
        .filter(
          (ov) =>
            !existingVideos.some((ev) =>
              ev._id ? ev._id === ov._id : ev.filename === ov.filename
            )
        )
        .map((v) => (v.filename ? v.filename : v._id));

      const removePdfs = originalPdfs
        .filter(
          (op) =>
            !existingPdfs.some((ep) =>
              ep._id ? ep._id === op._id : ep.filename === op.filename
            )
        )
        .map((p) => (p.filename ? p.filename : p._id));

      formData.append("removeVideos", JSON.stringify(removeVideos));
      formData.append("removePdfs", JSON.stringify(removePdfs));

      const res = await axios.post(
        `https://online-learning-portal-lms.onrender.com/api/courses/instructor/update/${editingCourseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Course updated successfully!");
      cancelEditing();

      // Update local courses list with updated course data
      const updatedCourses = courses.map((c) =>
        c._id === editingCourseId ? res.data : c
      );
      setCourses(updatedCourses);
    } catch (error) {
      console.error("Failed to update course", error);
      alert("Failed to update course. Please try again.");
      setIsUploading(false);
    }
  };

  const removeExistingVideo = (index) => {
    setExistingVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingPdf = (index) => {
    setExistingPdfs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">
        Manage Your Courses
      </h1>

      {courses.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No courses created yet.</p>
          <Link
            to="/instructor/create-course"
            className="mt-4 inline-block text-white bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
          >
            Start by Creating a Course
          </Link>
        </div>
      ) : (
        <div className="rounded-lg shadow mr-18">
          <table className="min-w-full divide-y divide-gray-200">
            {!editingCourseId && (
              <thead className="bg-indigo-100 text-gray-700 text-sm text-left">
                <tr>
                  <th className="px-4 py-2 font-semibold">Thumbnail</th>
                  <th className="px-4 py-2 font-semibold">Title</th>
                  <th className="px-4 py-2 font-semibold">Description</th>
                  <th className="px-4 py-2 font-semibold">Category</th>
                  <th className="px-4 py-2 font-semibold">Price</th>
                  <th className="px-4 py-2 font-semibold">Videos</th>
                  <th className="px-4 py-2 font-semibold">PDFs</th>
                  <th className="px-4 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
            )}

            <tbody className="divide-y divide-gray-200 bg-white">
              {courses
                .filter(
                  (course) => !editingCourseId || editingCourseId === course._id
                )
                .map((course) => {
                  const isEditing = editingCourseId === course._id;

                  return (
                    <tr key={course._id}>
                      {!isEditing ? (
                        <>
                          <td className="px-2 py-2">
                            {course.image && (
                              <img
                                src={`https://online-learning-portal-lms.onrender.com${course.image}`}
                                alt={course.title}
                                className="w-24 h-16 object-cover rounded"
                              />
                            )}
                          </td>
                          <td className="px-4 py-2">{course.title}</td>
                          <td className="px-4 py-2">{course.description}</td>
                          <td className="px-4 py-2">{course.category}</td>
                          <td className="px-4 py-2 font-semibold text-green-600">
                            ₹{course.price}
                          </td>
                          <td className="px-4 py-2">
                            {course.videos?.map((video, idx) => {
                              const videoUrl = `https://online-learning-portal-lms.onrender.com${
                                video.url || video.path || video
                              }`;
                              const videoName =
                                video.filename || `Video ${idx + 1}`;
                              return (
                                <div key={idx}>
                                  <p className="text-sm">{videoName}</p>
                                  <a
                                    href={videoUrl}
                                    rel="opener referrer"
                                    className="text-blue-600 hover:underline text-xs"
                                  >
                                    ▶ Preview
                                  </a>
                                </div>
                              );
                            })}
                          </td>
                          <td className="px-4 py-2 space-y-2">
                            {course.pdfs?.map((pdf, idx) => {
                              const pdfUrl = `https://online-learning-portal-lms.onrender.com${
                                pdf.url || pdf.path || pdf
                              }`;
                              const pdfName = pdf.filename || `PDF ${idx + 1}`;
                              return (
                                <div key={idx}>
                                  <p className="text-sm">{pdfName}</p>
                                  <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:underline text-xs"
                                  >
                                    📄 Open
                                  </a>
                                </div>
                              );
                            })}
                          </td>
                          <td className="px-4 py-2 space-x-2">
                            <button
                              onClick={() => startEditing(course)}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(course._id)}
                              className="text-red-600 hover:underline text-sm"
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </>
                      ) : (
                        <td colSpan={8} className="px-4 py-4">
                          <form
                            onSubmit={handleUpdate}
                            className="grid grid-cols-2 gap-4"
                          >
                            <input
                              type="text"
                              value={editFormData.title}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  title: e.target.value,
                                })
                              }
                              className="p-2 border rounded"
                              placeholder="Title"
                              required
                            />
                            <input
                              type="text"
                              value={editFormData.category}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  category: e.target.value,
                                })
                              }
                              className="p-2 border rounded"
                              placeholder="Category"
                              required
                            />
                            <textarea
                              value={editFormData.description}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  description: e.target.value,
                                })
                              }
                              className="col-span-2 p-2 border rounded"
                              placeholder="Description"
                              required
                            />
                            <input
                              type="number"
                              value={editFormData.price}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  price: e.target.value,
                                })
                              }
                              className="p-2 border rounded"
                              placeholder="Price"
                              required
                              min={0}
                            />
                            <br />
                            {/* Thumbnail Image */}
                            <div className="mb-3">
                              <label className="block font-medium text-gray-700 mb-1">
                                Choose Thumbnail Image:
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  setThumbnail(e.target.files[0])
                                }
                                className="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded file:border-0
               file:text-sm file:font-semibold
               file:bg-indigo-50 file:text-indigo-700
               hover:file:bg-indigo-100"
                              />
                            </div>

                            {/* Videos */}
                            <div className="mb-3">
                              <label className="block font-medium text-gray-700 mb-1">
                                Choose Videos:
                              </label>
                              <input
                                type="file"
                                accept="video/*"
                                multiple
                                onChange={(e) =>
                                  setNewVideos(Array.from(e.target.files))
                                }
                                className="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded file:border-0
               file:text-sm file:font-semibold
               file:bg-indigo-50 file:text-indigo-700
               hover:file:bg-indigo-100"
                              />
                            </div>

                            {/* PDFs */}
                            <div className="mb-3">
                              <label className="block font-medium text-gray-700 mb-1">
                                Choose PDFs:
                              </label>
                              <input
                                type="file"
                                accept="application/pdf"
                                multiple
                                onChange={(e) =>
                                  setNewPdfs(Array.from(e.target.files))
                                }
                                className="block w-full text-sm text-gray-500
               file:mr-4 file:py-2 file:px-4
               file:rounded file:border-0
               file:text-sm file:font-semibold
               file:bg-indigo-50 file:text-indigo-700
               hover:file:bg-indigo-100"
                              />
                            </div>

                            <div className="col-span-2">
                              {existingVideos.length > 0 && (
                                <div className="mb-2">
                                  <strong>Remove Videos:</strong>
                                  {existingVideos.map((v, idx) => (
                                    <div
                                      key={idx}
                                      className="text-sm flex justify-between items-center"
                                    >
                                      {v.filename}
                                      <button
                                        onClick={() => removeExistingVideo(idx)}
                                        type="button"
                                        className="text-red-600 text-xs hover:underline ml-2"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {existingPdfs.length > 0 && (
                                <div className="mb-2">
                                  <strong>Remove PDFs:</strong>
                                  {existingPdfs.map((p, idx) => (
                                    <div
                                      key={idx}
                                      className="text-sm flex justify-between items-center"
                                    >
                                      {p.filename}
                                      <button
                                        onClick={() => removeExistingPdf(idx)}
                                        type="button"
                                        className="text-red-600 text-xs hover:underline ml-2"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Uploading message */}
                            {isUploading && (
                              <div className="col-span-2 text-center text-indigo-600 font-semibold">
                                Uploading, please wait...
                              </div>
                            )}

                            <div className="col-span-2 flex justify-end space-x-3">
                              <button
                                type="submit"
                                disabled={isUploading}
                                className={`px-4 py-2 rounded text-white ${
                                  isUploading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                }`}
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                type="button"
                                disabled={isUploading}
                                className={`px-4 py-2 rounded text-white ${
                                  isUploading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gray-400 hover:bg-gray-500"
                                }`}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Editcourse;
