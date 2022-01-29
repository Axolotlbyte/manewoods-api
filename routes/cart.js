require("dotenv").config();
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");

const Cart = require("../models/cart");
const Item = require("../models/item");
const Product = require("../models/product");

const ObjectId = require('mongodb').ObjectId;

router.get("/:userid", auth, async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.userid);

    if(!cart) next(res.status(404).json({error: ["User not Found"]}))

    res.status(200).json({ cart, carts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: error.message });
  }
});

router.put("/:userid/product/:productid", auth, async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.userid);
    const product = await Product.findById(req.params.productid);
    const item = new Item({});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
