const { cloudinary } = require("../utils/cloudinary");

module.exports = async function (id) {
  const res = await cloudinary.uploader.destroy(id, (res) => {
    return res;
  });

  return res;
};
