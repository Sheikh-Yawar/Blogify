const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const Blog = require("./modals/blog");

const app = express();
const PORT = 3000;

mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then((e) => console.log("DB Connected"))
  .catch((e) => console.log("Couldn't connect to DB."));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  let allBlogs = await Blog.find({})
    .populate({
      path: "createdBy",
      select: "fullName -_id", // Select only the fullName field, exclude the _id
    })
    .sort({ createdAt: -1 });

  allBlogs = JSON.parse(JSON.stringify(allBlogs));

  // Format the createdAt timestamp for each blog
  allBlogs.forEach((blog) => {
    const isoDate = blog.createdAt;
    const date = new Date(isoDate);
    blog.formattedCreatedAt = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  });

  res.status(200).json({
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server Started at port ${PORT}`));
