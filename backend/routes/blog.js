const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../modals/blog");
const Comment = require("../modals/comments");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads/"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

router.post("/comment/:blogId", async (req, res) => {
  console.log(req.body);
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  let comments = await Comment.find({ blogId: req.params.blogId })
    .populate("createdBy")
    .sort({ createdAt: -1 });

  comments = JSON.parse(JSON.stringify(comments));

  comments.forEach((comment) => {
    comment.formattedDate = formatDate(comment.createdAt);
  });

  return res.status(200).json({ comments });
});

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

router.get("/:id", async (req, res) => {
  let blog = await Blog.findById(req.params.id).populate("createdBy");
  let comments = await Comment.find({ blogId: req.params.id })
    .populate("createdBy")
    .sort({ createdAt: -1 });

  blog = JSON.parse(JSON.stringify(blog));
  comments = JSON.parse(JSON.stringify(comments));

  blog.formattedDate = formatDate(blog.createdAt);

  comments.forEach((comment) => {
    comment.formattedDate = formatDate(comment.createdAt);
  });

  return res.status(200).json({
    user: req.user,
    blog,
    comments,
  });
});
router.post("/upload-image", upload.any(), async (req, res) => {
  return res.status(200).json({
    url: `/uploads/${req.files[0].filename}`,
  });
});

// router.post("/", upload.single("coverImage"), async (req, res) => {
//   const { title, body } = req.body;

//   const blog = await Blog.create({
//     title: title,
//     body: body,
//     createdBy: req.user._id,
//     coverImageURL: `/uploads/${req.file.filename}`,
//   });
//   return res.status(200).json({
//     id: blog._id,
//   });
// });

router.post("/", async (req, res) => {
  const { title, body, coverImageURL } = req.body;

  const blog = await Blog.create({
    title: title,
    body: body,
    createdBy: req.user._id,
    coverImageURL,
  });
  return res.status(200).json({
    id: blog._id,
  });
});

module.exports = router;
