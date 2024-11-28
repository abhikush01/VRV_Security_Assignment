import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader";

function Admin({ user }) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [viewingFiles, setViewingFiles] = useState(false); // Track if viewing files

  // Fetch users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await axios.get("http://localhost:8080/api/admin", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      setUsers(response.data);
      setFiles([]);
      setViewingFiles(false);
    } catch (error) {
      console.error("Error fetching users:", error.response || error.message);
    } finally {
      setLoading(false);
    }
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
      setViewingFiles(true);
    } catch (error) {
      console.error("Error fetching files:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Promote a user
  const promoteUser = async (userId) => {
    const jwt = localStorage.getItem("jwt");
    try {
      await axios.put(
        `http://localhost:8080/api/admin/${userId}/promote`,
        {}, // No body content needed
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      alert("User promoted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error promoting user:", error.response || error.message);
      alert("Failed to promote user. Please try again.");
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    const jwt = localStorage.getItem("jwt");
    try {
      await axios.delete(`http://localhost:8080/api/admin/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      alert("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error.response || error.message);
      alert("Failed to delete user. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
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
          <>
            <button
              onClick={fetchFiles}
              className="mt-4 text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            >
              View All Files
            </button>
          </>
        ) : (
          <>
            <button
              onClick={fetchUsers}
              className="mt-4 text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            >
              View All Users
            </button>
          </>
        )}
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 bg-white divide-y divide-gray-200">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    {viewingFiles ? (
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
                          Id
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 flex justify-end items-center"
                        >
                          Actions
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {viewingFiles
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
                    : users.map(
                        (user, index) =>
                          user.role !== "ADMIN" && (
                            <tr
                              key={user.id}
                              className="odd:bg-gray-50 even:bg-gray-100 border-b"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.role}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-end items-center gap-2">
                                {user.role === "VIEWER" && (
                                  <button
                                    onClick={() => promoteUser(user.id)}
                                    className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                                  >
                                    Promote
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          )
                      )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Admin;
