import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { Home, Login, Signup } from "./components/Pages";
import { useEffect, useState } from "react";
import axios from "axios";

function AppContent() {
  const [user, setUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      axios
        .get("http://localhost:8080/api", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        })
        .then((response) => {
          setUser(response.data);
          navigate("/");
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!file || !fileName) {
      alert("Please provide both a file and a name.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", fileName);

    axios
      .post("http://localhost:8080/api/files", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("File uploaded successfully!");
        setShowCreateModal(false);
        setFile(null);
        setFileName("");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Failed to upload file.");
      });
  };

  return (
    <>
      <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4] shadow-md">
        <Link
          to="/"
          className="text-xl font-semibold text-[#1f2937] hover:text-[#2563eb] transition"
        >
          File Uploader
        </Link>
        <div className="flex items-center space-x-4">
          {!localStorage.getItem("jwt") ? (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-[#2563eb] rounded-md hover:bg-[#1d4ed8] transition"
            >
              Login
            </Link>
          ) : (
            <>
              {user?.role === "CREATOR" && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition"
                >
                  Create
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>
      <main className="sm:p-8 px-4 py-8 w-full bg-gradient-to-b from-[#f9fafe] to-[#e6ebf4] min-h-[calc(100vh-73px)] ">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
        </Routes>
      </main>

      {/* Create File Upload Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Upload File
            </h2>
            <form onSubmit={handleFileUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AppContent;
