const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const formidable = require("formidable");

const Product = require("../models/product");
const auth = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");

const uploadToCloudinary = require("../middleware/uploadToCloudinary");
const deleteFromCloudinary = require("../middleware/deleteFromCloudinary");

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

    if (!product)
      res.status(404).json({ errors: [{ msg: "Product not found" }] });

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
    const filesArr = [];
    form.on("file", (fieldName, file) => {
      console.log(`Images retrieved from fieldname: ${fieldName}`);
      filesArr.push(file);
    });
    form.parse(req, async (err, fields, files) => {
      try {
        const product = new Product({
          name: fields.name,
          price: fields.price,
          quantity: fields.quantity,
          category: fields.category,
          description: fields.description,
        });

        files = [...filesArr];
        const images = [];
        for (let i = 0; i < files.length; i++) {
          const uploadRes = await uploadToCloudinary(files[i].filepath);
          images.push({
            _id: uploadRes.public_id,
            url: uploadRes.secure_url,
            isCover: i === 0 ? true : false,
          });
        }

        product.images = [...images];

        await product.save();

        res.status(200).json(product);
      } catch (error) {
        console.error(error);
      }
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
      const product = await Product.findById(req.params.id);

      if (!product) {
        res.status(404).json({ errors: [{ msg: "Product not found" }] });
      }

      const { name, price, quantity, category, description } = req.body;

      product.name = name;
      product.price = price;
      product.quantity = quantity;
      product.category = category;
      product.description = description;
      product.last_updated = Date.now();

      await product.save();

      res.status(200).json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: error.message });
    }
  }
);

// Add Images
router.put("/:id/images/", [auth, checkAdmin], async (req, res, next) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product)
        res.status(404).json({ errors: [{ msg: "Product not found" }] });

      const uploadRes = await uploadToCloudinary(files.image.filepath);

      const image = {
        _id: uploadRes.public_id,
        url: uploadRes.secure_url,
        isCover: product.images.length === 0 ? true : false,
      };
      product.images.push(image);
      product.last_updated = Date.now();
      await product.save();

      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
});

// Set a cover image
router.put(
  "/:id/cover/:imageid",
  [auth, checkAdmin],
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product)
        res.status(404).json({ errors: [{ msg: "Product not found" }] });

      const oldCover = product.images.find((item) => item.isCover === true);
      const newCover = product.images.find(
        (item) => item._id === req.params.imageid
      );

      oldCover.isCover = false;
      newCover.isCover = true;

      await oldCover.save();
      await newCover.save();

      product.last_updated = Date.now();

      await product.save();

      res.status(200).json(product);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: error.message });
    }
  }
);

// DELETE a product image
router.delete(
  "/:id/images/:imageid",
  [auth, checkAdmin],
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product)
        res.status(404).json({ errors: [{ msg: "Product not found" }] });

      const image = product.images.find(
        (item) => item._id === req.params.imageid
      );

      await deleteFromCloudinary(image._id);
      await image.remove();

      if (image.isCover) {
        const newCover = await product.images.findOne();
        newCover.isCover = true;

        await newCover.save();
      }

      product.last_updated = Date.now();
      await product.save();

      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// DELETE a product
router.delete("/:id", [auth, checkAdmin], async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      res.status(404).json({ errors: [{ msg: "Product not found" }] });

    const name = product.name;
    await product.remove();

    res.status(200).send(`${name} successfully Deleted`);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ errors: error.message });
  }
});

module.exports = router;
