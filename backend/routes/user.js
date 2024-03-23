const bcrypt = require("bcrypt");
const { Router } = require("express");
const User = require("../modals/user");
const { createTokenForUser } = require("../utils/authentication");

const router = Router();

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await User.matchPasswordAndGenerateToken(email, password);

    const user = await User.findOne(
      { email },
      {
        _id: 1,
        fullName: 1,
        email: 1,
        profileImageURL: 1,
        role: 1,
      }
    );
    res.cookie("token", token, {
      sameSite: "None",
      secure: true,
      httpOnly: true,
    });
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      error: error.message,
    });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await User.create({ fullName, email, password });
    const selectedUser = await User.findById(user._id, {
      _id: 1,
      fullName: 1,
      email: 1,
      profileImageURL: 1,
      role: 1,
    });
    const token = createTokenForUser(selectedUser);
    res.cookie("token", token, {
      sameSite: "None",
      secure: true,
      httpOnly: true,
    });
    console.log("User Created");
    return res.status(200).json({
      user: selectedUser,
    });
  } catch (err) {
    let error = "";
    if (err.message.includes("duplicate key error collection")) {
      error = "Email already in use.";
    }
    return res.status(500).json({
      error,
    });
  }
});

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User Logged Out" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
