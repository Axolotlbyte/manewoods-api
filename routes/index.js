const express = require("express");
const router = express.Router();
const { cloudinary } = require("../utils/cloudinary");
const upload = require("../utils/multer");

router.get("/", (req, res) => {
  res.json({
    routes: ["/api/product", "/api/category", "/api/cart", "/api/blog"],
  });
});

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: "ml_default",
    });
    console.log(uploadResponse);
    res.json({ msg: "Successfully Uploaded", data: uploadResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

module.exports = router;
