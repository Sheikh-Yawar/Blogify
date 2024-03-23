import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import { Link, useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import DOMPurify from "dompurify";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

function Blog() {
  const params = useParams();
  const location = useLocation();
  const { isUserLoggedIn } = location.state || {};

  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [blogData, setBlogData] = useState({
    blog: "",
    comments: "",
    user: "",
  });

  const stylePreTag = (html) => {
    const regex = /<pre>(.*?)<\/pre>/gs;
    return html.replace(regex, (match, code) => {
      return `<SyntaxHighlighter language="auto" style={solarizedlight}>${code}</SyntaxHighlighter>`;
    });
  };

  const getBlogData = async () => {
    const response = await fetch(`http://localhost:3000/blog/${params.id}`, {
      method: "GET",
      credentials: "include",
    });
    let responseData = await response.json();

    setBlogData({
      ...blogData,
      blog: responseData.blog,
      comments: responseData.comments,
      user: responseData.user,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    getBlogData();
  }, []);

  const handleTextAreaKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const response = await fetch(
        `http://localhost:3000/blog/comment/${params.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: comment }),
        }
      );

      const responseData = await response.json();
      setComment("");

      setBlogData({ ...blogData, comments: responseData.comments });
    }
  };
  const handleTextAreaChange = (e) => {
    setComment(e.target.value);
  };
  return (
    <div className="container">
      <Navbar isLoggedin={isUserLoggedIn} />
      {!isLoading && (
        <div className="mt-10">
          <div>
            <p className="text-4xl font-semibold ">{blogData.blog.title}</p>
            <div className="flex items-center gap-6 text-[#696A75] my-5">
              <div className="flex items-center gap-2">
                <img
                  src="../../public/images/potrait_image.jpg"
                  className="rounded-[28px] h-[28px] w-[28px]"
                />
                <p className="font-medium text-[16px]">
                  {blogData.blog.createdBy.fullName}
                </p>
              </div>
              <p className="font-light text-[16px]">
                {blogData.blog.formattedDate}
              </p>
            </div>
            <img
              src={blogData.blog.coverImageURL}
              className="rounded-xl h-[480px] w-[100%] object-cover"
            />
          </div>
          <div className="my-5">
            <div
              className=" font-workSans"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(blogData.blog.body),
              }}
            />
          </div>

          <div className="mb-8">
            <p className="text-xl font-semibold">{`Comments(${blogData.comments.length})`}</p>
            {isUserLoggedIn ? (
              <>
                <textarea
                  value={comment}
                  type="text"
                  placeholder="Your thoughts here, whether they're funny, punny, or just plain silly!"
                  onChange={handleTextAreaChange}
                  onKeyDown={handleTextAreaKeyDown}
                  className="w-[100%] h-24 mt-2 rounded-md border-2 border-gray-400 p-2  text-[20px] font-normal font-[#3B3C4A] resize-none"
                />
                <div className="my-3">
                  {blogData.comments.map((comment) => {
                    return (
                      <Comment
                        key={comment._id}
                        content={comment.content}
                        author={comment.createdBy.fullName}
                        createdAt={comment.formattedDate}
                      />
                    );
                  })}
                </div>
              </>
            ) : (
              <Link to="/auth">
                <div className="text-2xl font-bold my-5 border-gray-400 rounded-md border-[1px] p-5 text-center cursor-pointer hover:border-[#4B6BFB]">
                  Please log in to view comments.
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
