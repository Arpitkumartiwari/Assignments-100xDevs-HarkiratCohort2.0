const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  Admin.create({
    username: username,
    password: password,
  })
    .then(() => {
      res.status(201).json({
        msg: "Admin Created Successfully",
      });
    })
    .catch(() => {
      res.status(500).json({
        msg: "Admin Couldn't be Created",
      });
    });
});

router.post("/courses", adminMiddleware, async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageLink = req.body.imageLink;

  try {
    const newCourse = await Course.create({
      title,
      description,
      price,
      imageLink,
    });

    res.status(201).json({
      msg: "Course Created Successfully",
      courseId: newCourse._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
  const response = await Course.find({});
  if (response) {
    res.status(200).json({
      Courses: response,
    });
  } else {
    res.status(404).json({
      msg: "Courses Not Found !!",
    });
  }
});

module.exports = router;
