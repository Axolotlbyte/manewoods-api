const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { cloudinary } = require("../utils/cloudinary");

const Product = require("../models/product");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

const upload = require("../utils/multer");
const uploadToCloudinary = require("../middleware/uploadToCloudinary");

// GET all products
router.get("/", async function (req, res, next) {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: err.message }] });
  }
});

// GET products by id
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ errors: [{ msg: "Product not found" }] });
      next();
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: [{ msg: error.message }] });
  }
});

// POST a product
router.post(
  "/",
  [
    auth,
    checkAdmin,
    [
      check("name", "Enter a name for your product").trim().not().isEmpty(),
      check("price", "Enter a price for your product").trim().not().isEmpty(),
      check("quantity", "Enter quantity for your product")
        .trim()
        .not()
        .isEmpty(),
    ],
  ],
  upload.array("product-images", 12),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400), json({ error: error.array() });
    }
    try {
      const product = new Product({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
      });

      const images = [];
      for (let i = 0; i < req.files.length; i++) {
        const res = await uploadToCloudinary(req.files[i].path);
        images.push({
          _id: res.public_id,
          url: res.secure_url,
          isCover: i === 0 ? true : false,
        });
      }

      product.images = [...images];

      await product.save();

      res.status(200).json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: error.message });
    }
  }
);

// UPDATE a product
router.put(
  "/:id",
  [
    auth,
    checkAdmin,
    [
      check("name", "Enter a name for your product").trim().not().isEmpty(),
      check("price", "Enter a price for your product").trim().not().isEmpty(),
      check("quantity", "Enter quantity for your product")
        .trim()
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400), json({ error: error.array() });
    }
    try {
      const product = Product.findById(req.params.id);

      if (!product) {
        res.status(404).json({ errors: [{ msg: "Product not found" }] });
      }

      const { name, price, quantity, category, images } = req.body;

      product.name = name;
      product.price = price;
      product.quantity = quantity;
      product.category = category;
      product.images = images;

      await product.save();

      res.status(200).json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: error.message });
    }
  }
);

// DELETE a product
router.delete("/:id", [auth, checkAdmin], async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ errors: [{ msg: "Product not found" }] });
    }

    const name = product.name;
    await product.remove();

    res.json(`${name} successfully Deleted`);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: error.message });
  }
});

module.exports = router;
