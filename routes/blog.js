const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const checkBlogger = require("../middleware/checkBlogger");

const Blog = require("../models/blog");

require("dotenv").config();

//Post route
router.post(
  "/",
  [
    auth,
    checkBlogger,
    [
      check("title", "Enter a title for your post").trim().not().isEmpty(),
      check("content", "Post body must not be empty").trim().not().isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400), json({ error: error.array() });
    }

    try {
      const newBlog = new Blog({
        user: req.user.id,
        title: req.body.title,
        content: req.body.content,
      });

      const blog = await newBlog.save();

      res.status(200).json(blog);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//Edit Blog route
router.put(
  "/:id",
  [
    auth,
    checkBlogger,
    [
      check("title", "Enter a title for your post").trim().not().isEmpty(),
      check("content", "Post body must not be empty").trim().not().isEmpty(),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let blog = await Blog.findById(req.params.id);

      if (!blog) {
        return res.status(400).json({ errors: [{ msg: "Blog not found" }] });
      }

      const { title, content } = req.body;

      blog.title = title;
      blog.content = content;

      await blog.save();

      res.json(blog);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// Get all Blogs route
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });

    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

//Get Blog by id
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("user");

    if (!blog) {
      res.status(404).json({ errors: [{ msg: "Blog not found" }] });
    }

    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Delete an Blog
router.delete("/:id", auth, checkBlogger, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ errors: [{ msg: "Blog not found" }] });
    }

    await blog.remove();

    res.json({ msg: "Blog removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
