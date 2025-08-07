import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-sky-200 flex flex-col justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">🚫 Access Denied</h1>
        <p className="text-gray-700 text-lg mb-6">
          You are not authorized to access this page.
        </p>
        <Link
          to="/"
          className="bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
