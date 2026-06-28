const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadToCloudinary = async (path, folder = "pallery") => {
  try {
    const data = await cloudinary.uploader.upload(path, { folder: folder });
    return { url: data.secure_url, publicId: data.public_id };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload, uploadToCloudinary };
