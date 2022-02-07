const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const formidable = require("formidable");

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
router.post("/", [auth, checkAdmin], async (req, res, next) => {
  try {
    const form = new formidable.IncomingForm();
    await form.parse(req, async (err, fields, files) => {
      if (err) res.status(500).send("An Error Occured");
      const product = new Product({
        name: fields.name,
        price: fields.price,
        quantity: fields.quantity,
        category: fields.category,
        description: fields.description,
      });

      const images = [];
      for (let i = 0; i < files.length; i++) {
        const uploadRes = await uploadToCloudinary(files[i].path);
        images.push({
          _id: uploadRes.public_id,
          url: uploadRes.secure_url,
          isCover: i === 0 ? true : false,
        });
      }

      product.images = [...images];

      await product.save();

      res.status(200).json(product);
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ errors: error.message });
  }
});

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

      const { name, price, quantity, category } = req.body;

      product.name = name;
      product.price = price;
      product.quantity = quantity;
      product.category = category;

      await product.save();

      res.status(200).json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: error.message });
    }
  }
);

// Add Images
router.put(
  "/:id/images/",
  [auth, checkAdmin],
  upload.single("image"),
  async (req, res, next) => {
    try {
      const product = Product.findById(req.params.id);
      const uploadRes = await uploadToCloudinary(req.file.path);

      const image = {
        _id: uploadRes.public_id,
        url: uploadRes.secure_url,
        isCover: i === 0 ? true : false,
      };
      product.images.push(image);

      await product.save();

      res.status(200).json(product);
    } catch (error) {}
  }
);

// Set a cover image
router.put(
  "/:id/cover/:imageid",
  [auth, checkAdmin],
  async (req, res, next) => {
    try {
      const product = Product.findById(req.params.id);
      const images = [...product.images];

      for (let i = 0; i < images.length; i++) {
        if (images[i]._id === req.params.imageid) {
          images[i].isCover = true;
          continue;
        }
        if (images[i].isCover === true) {
          images[i].isCover = false;
        }
      }
      product.images = images;

      await product.save();
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

    res.status(200).send(`${name} successfully Deleted`);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: error.message });
  }
});

module.exports = router;
