const { cloudinary } = require("../utils/cloudinary");

module.exports = async function (image) {
  const uploadResponse = await cloudinary.uploader.upload(image, {
    upload_preset: "ml_default",
  });

  return uploadResponse;
};
