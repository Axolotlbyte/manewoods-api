const express = require("express");
const router = express.Router();
const { cloudinary } = require("../utils/cloudinary");
const upload = require("../utils/multer");
const formidable = require("formidable");

router.get("/", (req, res) => {
  res.json({
    routes: ["/api/product", "/api/category", "/api/cart", "/api/blog"],
  });
});

router.post("/upload", upload.array("images", 12), async (req, res) => {
  try {
    // const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
    //   upload_preset: "ml_default",
    // });
    // console.log(uploadResponse);
    console.log(req.body);
    if (req.file) {
      console.log("Working");
    }

    const images = [...req.files];
    // for (let i = 0; i < req.files.length; i++) {
    //   const res = await uploadToCloudinary(req.files[i].path);
    //   images.push({
    //     _id: res.public_id,
    //     url: res.secure_url,
    //     isCover: i === 0 ? true : false,
    //   });
    // }
    res.json({ msg: "Successfully Uploaded", data: images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

router.post("/multipart", async (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    files = Object.keys(files).map(key => files[key])
    res.json({fields, files});
  });
});

module.exports = router;
