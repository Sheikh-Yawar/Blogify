import Navbar from "../components/Navbar";
import MainBlog from "../components/MainBlog";
import SmallBlog from "../components/SmallBlog";
import Spinner from "../components/Spinner";
import { AuthContext } from "../contexts/authContext";
import { useContext, useEffect, useState } from "react";
function Home() {
  const authContext = useContext(AuthContext);
  const [blogData, setBlogData] = useState([]);

  const getData = async () => {
    const response = await fetch("http://localhost:3000/", {
      method: "GET",
      credentials: "include",
    });
    const responseData = await response.json();
    setBlogData(responseData.blogs);
    if ("user" in responseData) {
      authContext.setAuth(true);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="container">
      <Navbar isLoggedin={authContext.auth} />
      {blogData.length > 0 ? (
        <>
          <MainBlog
            title={blogData[0].title}
            author={blogData[0].createdBy.fullName}
            createdAt={blogData[0].formattedCreatedAt}
            coverImageURL={blogData[0].coverImageURL}
            id={blogData[0]._id}
          />
          <div className="flex flex-wrap gap-5 my-12">
            {blogData.map(
              (blog, index) =>
                index != 0 && (
                  <SmallBlog
                    key={blog._id}
                    title={blog.title}
                    author={blog.createdBy.fullName}
                    createdAt={blog.formattedCreatedAt}
                    coverImageURL={blog.coverImageURL}
                    id={blog._id}
                  />
                )
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-center mt-44 ">
          <Spinner width={"100px"} height={"100px"} />
        </div>
      )}
    </div>
  );
}

export default Home;
