const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Category = require("../models/category");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

// PRODUCT CATEGORY ROUTES

router.get("/", async (req, res, next) => {
  try {
    console.log("working");
    const categories = await Category.find();

    res.json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: error.message });
  }
});

router.post(
  "/",
  [
    auth,
    checkAdmin,
    [check("name", "Enter a name for your Category").trim().not().isEmpty()],
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const category = new Category({
        name: req.body.name,
      });

      await category.save();

      res.json(category);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: error.message });
    }
  }
);

router.put(
  "/:categoryid",
  [
    auth,
    checkAdmin,
    [check("name", "Enter a name for your Category").trim().not().isEmpty()],
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const category = await Category.findById(req.params.categoryid);

      if (!category) {
        res.status(404).json({ errors: [{ msg: "Category not found" }] });
      }

      category.name = req.body.name;

      await category.save();

      res.json(category);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: error.message });
    }
  }
);

router.delete("/:categoryid", [auth, checkAdmin], async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryid);

    if (!category) {
      res.status(404).json({ errors: [{ msg: "Blog not found" }] });
    }
    await category.remove();

    res.json({ msg: "Category successfully deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: error.message });
  }
});

module.exports = router;
