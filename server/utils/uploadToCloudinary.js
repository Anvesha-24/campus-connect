// server/utils/uploadToCloudinary.js
//
// Uploads a file buffer (from multer's memoryStorage) to Cloudinary and
// returns the resulting permanent URL. Using memoryStorage + a direct
// buffer upload means the file never touches Render's ephemeral local
// disk at all - it goes straight from the request to Cloudinary.

const cloudinary = require("./cloudinary");
const { Readable } = require("stream");

/**
 * @param {Buffer} buffer - the file's raw data
 * @param {object} opts
 * @param {string} opts.folder - Cloudinary folder to organize uploads, e.g. "campus-connect/items"
 * @param {"image"|"raw"} opts.resourceType - "image" for photos/avatars, "raw" for PDFs and other non-image files
 * @returns {Promise<{url: string, publicId: string}>}
 */
function uploadBufferToCloudinary(buffer, { folder, resourceType = "image" }) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

module.exports = { uploadBufferToCloudinary };

