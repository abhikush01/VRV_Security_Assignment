import Admin from "./Admin";
import { Creator, Viewer } from ".";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home({ user }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  });

  return (
    <>
      {user?.role === "ADMIN" ? (
        <Admin user={user} />
      ) : user?.role === "VIEWER" ? (
        <>
          <Viewer user={user} />
        </>
      ) : (
        <>
          <Creator user={user} />
        </>
      )}
    </>
  );
}

export default Home;
