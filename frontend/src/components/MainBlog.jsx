import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";

function MainBlog({ title, author, createdAt, coverImageURL, id }) {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const handleBlogClick = (e) => {
    navigate(`/blog/${id}`, {
      state: {
        isUserLoggedIn: authContext.auth,
      },
    });
  };
  return (
    <div onClick={handleBlogClick} className="mt-12 cursor-pointer ">
      <div className="relative">
        <img
          src={coverImageURL}
          className="rounded-xl h-[450px] w-[100%] object-cover"
        />
        <div className="absolute text-white bottom-10 left-10">
          <p className="text-4xl font-semibold w-[740px]">{title}</p>
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <img
                src="../../images/default.png"
                className="rounded-[28px] h-[28px] w-[28px]"
              />
              <p className="font-medium text-[16px]">{author}</p>
            </div>
            <p className="font-light text-[16px]">{createdAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainBlog;
