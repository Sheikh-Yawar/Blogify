import React, { useContext, useState } from "react";
import { EditorState, Modifier, SelectionState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import draftToHtml from "draftjs-to-html";
import { AuthContext } from "../contexts/authContext";
import Spinner from "../components/Spinner";

function AddBlog() {
  const [title, setTitle] = useState("");
  const [coverImageURL, setCoverImageURL] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const handlePublishClick = async () => {
    const plainText = editorState.getCurrentContent().getPlainText();
    if (coverImageURL.length === 0) {
      toast.error("Please input a Cover Image Url.");
      return;
    }
    if (title.length === 0) {
      toast.error("Please input a title.");
      return;
    }
    if (plainText.trim().length === 0) {
      toast.error("Please write something to publish.");
      return;
    }

    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    setIsPublishing(true);

    const response = await fetch("http://localhost:3000/blog", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body: html,
        coverImageURL,
      }),
    });

    const responseData = await response.json();
    console.log(responseData);

    setIsPublishing(false);

    navigate(`/blog/${responseData.id}`, {
      state: {
        isUserLoggedIn: authContext.auth,
      },
    });
  };

  const handleEditorChange = () => {
    const contentState = editorState.getCurrentContent();
    const lastCharacter = contentState.getLastBlock().getText().slice(-1);
    const lastBlock = contentState.getLastBlock();

    if (lastCharacter === "&") {
      const blockKey = lastBlock.getKey();
      const blockLength = lastBlock.getLength();
      const selectionState = SelectionState.createEmpty(blockKey).merge({
        anchorOffset: blockLength - 1,
        focusOffset: blockLength,
      });
      const newContentState = Modifier.replaceText(
        contentState,
        selectionState,
        "and"
      );
      const newSelectionState = SelectionState.createEmpty(blockKey).merge({
        anchorOffset: blockLength + 2, // +3 to account for the length of "and"
        focusOffset: blockLength + 2,
      });
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "insert-characters"
      );
      // Update the editor state with the new selection state
      const editorStateWithNewSelection = EditorState.forceSelection(
        newEditorState,
        newSelectionState
      );
      setEditorState(editorStateWithNewSelection);
    }
  };

  // const uploadCallback = async (file) => {
  //   const formData = new FormData();
  //   formData.append("blog-image", file);
  //   // Send the request to the server for image upload
  //   try {
  //     const response = await fetch("http://localhost:3000/blog/upload-image", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       toast.error("Image upload failed");
  //       return;
  //     }
  //     const uploadedImageData = await response.json();
  //     console.log(uploadedImageData);

  //     const localSrc = URL.createObjectURL(file);
  //     // Resolve the promise with the blob URL
  //     return { data: { link: localSrc } };
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     return Promise.reject(error); // Reject the promise with the error
  //   }
  // };

  return (
    <div className="h-[100vh] px-4">
      <header className="flex items-baseline justify-between pt-3 pb-5 ">
        <Link to="/">
          <p className="font-bold text-[3rem] select-none cursor-pointer">
            Blogify.
          </p>
        </Link>
        <button
          onClick={handlePublishClick}
          className="bg-[#4B6BFB] px-5 py-2 text-white text-[16px] font-semibold  rounded-md h-fit "
        >
          {isPublishing ? (
            <Spinner height={"20px"} width={"30px"} />
          ) : (
            "Publish"
          )}
        </button>
      </header>

      <input
        placeholder="Title"
        name="Blog Title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-md  h-16 w-[80%] border-[1px] outline-[#4B6BFB] font-medium px-2  mb-5 placeholder:text-4xl placeholder:text-[#9197a3a7] text-4xl"
      />
      <input
        placeholder="Cover Image Url"
        type="text"
        value={coverImageURL}
        onChange={(e) => setCoverImageURL(e.target.value)}
        className="rounded-md  h-12 w-[80%] border-[1px] outline-[#4B6BFB] font-medium px-2  mb-5 placeholder:text-2xl placeholder:text-[#9197a3a7] text-2xl"
      />

      <Editor
        placeholder="Tell your story..."
        onChange={handleEditorChange}
        wrapperClassName=""
        editorClassName="p-2 "
        toolbarClassName="p-1 border-[1px] border-slate-200 z-10 "
        editorState={editorState}
        onEditorStateChange={setEditorState}
        // toolbarCustomButtons={[
        //   <CustomOption editorState={editorState} onChange={setEditorState} />,
        // ]}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "emoji",
            "image",
          ],
          // image: {
          //   uploadCallback,
          // },
        }}
      />
    </div>
  );
}

// const CustomOption = ({ editorState, onChange }) => {
//   const addStar = () => {
//     const contentState = Modifier.replaceText(
//       editorState.getCurrentContent(),
//       editorState.getSelection(),
//       "⭐",
//       editorState.getCurrentInlineStyle()
//     );
//     onChange(EditorState.push(editorState, contentState, "insert-characters"));
//   };

//   return <div onClick={addStar}>⭐</div>;
// };
export default AddBlog;
