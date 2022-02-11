require("dotenv").config();
const router = require("express").Router();

const auth = require("../middleware/auth");

const Cart = require("../models/cart");
const Product = require("../models/product");

router.get("/:userid", auth, async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.userid);

    if (!cart) next(res.status(404).json({ error: ["User not Found"] }));

    res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: error.message });
  }
});

router.put("/:userid/product/:productid", auth, async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.userid);
    const product = await Product.findById(req.params.productid);
    const item = {
      product: product._id,
      quantity: req.query.quantity,
    };

    cart.items.push(item);

    await cart.save();
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
