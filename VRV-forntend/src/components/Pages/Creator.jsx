import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader";

function Creator({ user }) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [viewingFiles, setViewingFiles] = useState(false);
  const [editingFile, setEditingFile] = useState(null); // File being edited
  const [newFileName, setNewFileName] = useState(""); // New file name

  const handleFileChange = () => {
    setViewingFiles(true);
  };

  // Fetch files from the backend
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await axios.get("http://localhost:8080/api/files", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setFiles(response.data);
      setViewingFiles(false);
    } catch (error) {
      console.error("Error fetching files:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a File
  const deleteFile = async (fileId) => {
    const jwt = localStorage.getItem("jwt");
    try {
      await axios.delete(`http://localhost:8080/api/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      alert("File deleted successfully!");
      fetchFiles();
    } catch (error) {
      console.error("Error deleting File:", error.response || error.message);
      alert("Failed to delete File. Please try again.");
    }
  };

  // Open edit modal
  const openEditModal = (file) => {
    setEditingFile(file);
    setNewFileName(file.name);
  };

  // Update file name
  const updateFile = async () => {
    const jwt = localStorage.getItem("jwt");
    try {
      await axios.put(
        `http://localhost:8080/api/files/${editingFile.id}`,
        { name: newFileName },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      alert("File updated successfully!");
      fetchFiles();
      setEditingFile(null); // Close modal
    } catch (error) {
      console.error("Error updating file:", error.response || error.message);
      alert("Failed to update file. Please try again.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          {user?.name}
        </h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          {user?.email}
        </p>
        {!viewingFiles ? (
          <button
            onClick={handleFileChange}
            className="mt-4 text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            Your Files
          </button>
        ) : (
          <button
            onClick={fetchFiles}
            className="mt-4 text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            View All Files
          </button>
        )}
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 bg-white divide-y divide-gray-200">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  {!viewingFiles ? (
                    <>
                      <th scope="col" className="px-6 py-3">
                        File ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        File Name
                      </th>
                    </>
                  ) : (
                    <>
                      <th scope="col" className="px-6 py-3">
                        File Id
                      </th>
                      <th scope="col" className="px-6 py-3">
                        File Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {!viewingFiles
                  ? files.map((file) => (
                      <tr
                        key={file.id}
                        className="odd:bg-gray-50 even:bg-gray-100 border-b"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {file.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a href={file.cloudinaryUrl}>{file.name}</a>
                        </td>
                      </tr>
                    ))
                  : user?.files?.map((file, index) => (
                      <tr
                        key={file.id}
                        className="odd:bg-gray-50 even:bg-gray-100 border-b"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {file.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-end items-center gap-2">
                          <button
                            onClick={() => openEditModal(file)}
                            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteFile(file.id)}
                            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Edit File</h2>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingFile(null)}
                className="text-gray-600 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateFile}
                className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Creator;
