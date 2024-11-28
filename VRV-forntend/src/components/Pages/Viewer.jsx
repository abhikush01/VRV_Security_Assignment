import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader";

function Home({ user }) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

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
    } catch (error) {
      console.error("Error fetching files:", error.response || error.message);
    } finally {
      setLoading(false);
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
                    <th scope="col" className="px-6 py-3">
                      File ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      File Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default Home;
