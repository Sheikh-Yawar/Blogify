import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";

function UploadImage({ handleSelectedFile }) {
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      setFileName(file.name);
      setFileUrl(URL.createObjectURL(file));
      handleSelectedFile(event);
    }
  };

  const handleImageClick = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  const handleImageDeleteClick = (e) => {
    setFileName("");
    setFileUrl("");
  };
  return (
    <label
      className="flex justify-center h-16 py-6 text-sm transition bg-white border border-gray-300 border-dashed rounded-md appearance-none cursor-pointer w-[40%] hover:border-gray-400 focus:border-solid focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:opacity-75"
      tabIndex="0"
    >
      {fileName.length > 0 ? (
        <div className="flex justify-center  align-baseline w-[100%]">
          <p
            onClick={handleImageClick}
            className="text-xs text-left text-blue-600 hover:underline w-[80%] text-ellipsis overflow-hidden pl-2"
          >
            {fileName}
          </p>
          <MdDeleteOutline
            className="text-red-600 hover:scale-125"
            onClick={handleImageDeleteClick}
          />
        </div>
      ) : (
        <span
          htmlFor="photo-dropbox"
          className="flex items-center px-8 space-x-2"
        >
          <svg className="w-6 h-6 stroke-gray-400" viewBox="0 0 256 256">
            <path
              d="M96,208H72A56,56,0,0,1,72,96a57.5,57.5,0,0,1,13.9,1.7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></path>
            <path
              d="M80,128a80,80,0,1,1,144,48"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></path>
            <polyline
              points="118.1 161.9 152 128 185.9 161.9"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></polyline>
            <line
              x1="152"
              y1="208"
              x2="152"
              y2="128"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="24"
            ></line>
          </svg>
          <span className="text-xs font-medium text-gray-600">Cover Image</span>
        </span>
      )}
      <input
        type="file"
        onChange={handleFileChange}
        name="coverImage"
        className="sr-only w-[50%] bg-slate-600"
        accept="image/*"
      />
    </label>
  );
}

export default UploadImage;
