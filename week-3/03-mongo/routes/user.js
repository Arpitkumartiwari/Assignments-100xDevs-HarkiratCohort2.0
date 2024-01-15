const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const mongoose = require("mongoose");

// User Routes
router.post("/signup", (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  User.create({
    username: username,
    password: password,
    PurchasedCourses: [],
  })
    .then(() => {
      res.status(201).json({
        msg: "User Created Successfully",
      });
    })
    .catch(() => {
      res.status(500).json({
        msg: "User Couldn't be Created",
      });
    });
});

router.get("/courses", (req, res) => {
  Course.find({}).then((value) => {
    res.status(200).json({
      Courses: value,
    });
  });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  const courseId = req.params.courseId;
  const username = req.headers.username;

  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.PurchasedCourses = user.PurchasedCourses || [];
  user.PurchasedCourses.push(courseId);
  await user.save();
  res.json({
    message: "Purchase complete!",
  });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  const user = await User.findOne({ username: req.headers.username });
  const Courses = await Course.find({
    _id: {
      $in: user.PurchasedCourses,
    },
  });
  res.status(200).json({
    courses: Courses,
  });
});

module.exports = router;
