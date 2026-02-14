const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ============================
// Cloudinary Config
// ============================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============================
// Storage Config
// ============================
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Route based naming like S3
    const basePath = req.baseUrl?.split("/api/")[1] || "";

    const publicId =
      (basePath ? basePath + "_" : "") +
      Date.now() +
      "_" +
      file.originalname.split(".")[0];

    return {
      folder: process.env.CLOUDINARY_FOLDER || "myapp-images",
      resource_type: "image",
      public_id: publicId,
    };
  },
});

// ============================
// Upload Middleware
// ============================
const uploadImage = multer({
  storage,
  fileFilter: (req, file, callback) => {
    if (req.body.image_updated === "false") {
      return callback(null, false);
    }

    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files allowed"), false);
    }

    callback(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 20, // 20MB
  },
});

// ============================
// Delete Image
// ============================
const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Extract public_id from Cloudinary URL
    const parts = imageUrl.split("/");
    const uploadIndex = parts.indexOf("upload");
    const publicPath = parts
      .slice(uploadIndex + 2)
      .join("/")
      .split(".")[0];

    await cloudinary.uploader.destroy(publicPath, {
      invalidate: true,
    });

    return true;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    return false;
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
};
