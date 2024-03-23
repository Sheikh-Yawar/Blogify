import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

function SmallBlog({ title, author, createdAt, coverImageURL, id }) {
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
    <div
      onClick={handleBlogClick}
      className="h-[450px] w-[330px] rounded-xl border-[1px] border-[#E8E8EA] px-4 py-3 cursor-pointer"
    >
      <img
        src={coverImageURL}
        className="h-[220px] w-[310px] rounded-md object-cover"
      />
      <div>
        <p className="my-5 text-2xl font-semibold">{title}</p>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <img
              src="../../images/potrait_image.jpg"
              className="rounded-[28px] h-[28px] w-[28px]"
            />
            <p className="font-medium text-[16px]">{author}</p>
          </div>
          <p className="font-light text-[16px]">{createdAt}</p>
        </div>
      </div>
    </div>
  );
}

export default SmallBlog;
