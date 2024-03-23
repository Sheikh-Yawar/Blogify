function Comment({ content, author, createdAt }) {
  return (
    <div className="my-5 border-gray-400 rounded-md border-[1px] p-5">
      <div className="flex items-center gap-4 text-[#696A75] mb-2">
        <img
          src="../../public/images/potrait_image.jpg"
          className="rounded-[40px] h-[40px] w-[40px]"
        />
        <div className="flex flex-col ">
          <p className="font-medium text-[14px]">{author}</p>
          <p className="font-light text-[14px]">{createdAt}</p>
        </div>
      </div>
      <div>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default Comment;
