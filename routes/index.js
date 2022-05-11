const express = require("express");
const router = express.Router();
const { cloudinary } = require("../utils/cloudinary");
const upload = require("../utils/multer");
const formidable = require("formidable");
const fs = require("fs");

const uploadToCloudinary = require("../middleware/uploadToCloudinary");

router.get("/", (req, res) => {
  res.json({
    routes: ["/api/product", "/api/category", "/api/cart", "/api/blog"],
  });
});

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
    //   upload_preset: "ml_default",
    // });
    // console.log(uploadResponse);
    console.log(req.body);
    if (req.files) {
      console.log("Working");
    }

    const uploadRes = await uploadToCloudinary(req.file.path);

    fs.unlinkSync(req.file.path);

    res.json({
      msg: "Successfully Uploaded",
      upload: { _id: uploadRes.public_id, url: uploadRes.secure_url },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.post("/multipart", async (req, res, next) => {
  const form = new formidable.IncomingForm();
  const filesArr = [];
  form.on("file", (fieldName, file) => {
    filesArr.push(file);
  });
  form.parse(req, (err, fields, files) => {
    res.json({ ...fields, images: filesArr });
  });
});

module.exports = router;
