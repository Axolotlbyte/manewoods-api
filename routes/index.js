const express = require("express");
const router = express.Router();
const { cloudinary } = require("../middleware/cloudinary");
var fs = require("fs");
const path = require("path");

// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}

router.post("/upload", async (req, res) => {
  try {
    const fileStr = req.body.img;
    const uploadResponse = await cloudinary.uploader.upload(path.join(__dirname, "../test-img.jpeg"), {
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
