import React, { useState } from 'react';
import axios from 'axios';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    image: null,
    pdfs: [],
    videos: [],
  });

  const [preview, setPreview] = useState({
    imageUrl: null,
    pdfNames: [],
    videoNames: [],
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview((prev) => ({
        ...prev,
        imageUrl: file ? URL.createObjectURL(file) : null,
      }));
    } else if (name === 'pdfs') {
      const fileArray = Array.from(files);
      setFormData((prev) => ({ ...prev, pdfs: fileArray }));
      setPreview((prev) => ({
        ...prev,
        pdfNames: fileArray.map((file) => file.name),
      }));
    } else if (name === 'videos') {
      const fileArray = Array.from(files);
      setFormData((prev) => ({ ...prev, videos: fileArray }));
      setPreview((prev) => ({
        ...prev,
        videoNames: fileArray.map((file) => file.name),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const token = localStorage.getItem('token');
    const submission = new FormData();

    submission.append('title', formData.title);
    submission.append('description', formData.description);
    submission.append('category', formData.category);
    submission.append('price', formData.price);

    if (formData.image) {
      submission.append('image', formData.image);
    }

    formData.pdfs.forEach((file) => submission.append('files', file));
    formData.videos.forEach((file) => submission.append('files', file));

    try {
      const res = await axios.post('https://online-learning-portal-lms.onrender.com//api/courses/addCourse', submission, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMsg('Course created successfully!');
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        image: null,
        pdfs: [],
        videos: [],
      });
      setPreview({
        imageUrl: null,
        pdfNames: [],
        videoNames: [],
      });
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to create course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Create a New Course</h2>

      {successMsg && <p className="text-green-600 mb-3">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mb-3">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Course Title"
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Course Description"
          required
          className="w-full border p-2 rounded h-28"
        />

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price (₹)"
          required
          className="w-full border p-2 rounded"
        />

        {/* Image upload */}
        <div>
          <label className="block mb-1 font-medium">Thumbnail Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          {preview.imageUrl && (
            <img
              src={preview.imageUrl}
              alt="Thumbnail Preview"
              className="mt-2 w-40 h-24 object-cover rounded border"
            />
          )}
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block mb-1 font-medium">PDF Files</label>
          <input
            type="file"
            name="pdfs"
            accept="application/pdf"
            multiple
            onChange={handleChange}
            className="w-full"
          />
          {preview.pdfNames.length > 0 && (
            <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
              {preview.pdfNames.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Video Upload */}
        <div>
          <label className="block mb-1 font-medium">Video Files</label>
          <input
            type="file"
            name="videos"
            accept="video/*"
            multiple
            onChange={handleChange}
            className="w-full"
          />
          {preview.videoNames.length > 0 && (
            <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
              {preview.videoNames.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
