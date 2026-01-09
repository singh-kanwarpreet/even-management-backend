const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

// Setup storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "event-management",
    format: async (req, file) => file.mimetype.split("/")[1], // jpg, png etc
    allowed_formats: ["jpg", "png", "gif", "jpeg"],
  },
});

const parser = multer({ storage });

module.exports = parser;
