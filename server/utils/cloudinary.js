// server/utils/cloudinary.js
//
// Configures the Cloudinary SDK from environment variables. Cloudinary is
// used for all file uploads (item images, material PDFs, avatars) because
// Render's free-tier filesystem is ephemeral - anything saved to local disk
// is wiped on every redeploy, restart, or spin-down. Cloudinary's free tier
// gives persistent storage that survives deploys.
//
// Requires these in .env (free account at cloudinary.com):
//   CLOUDINARY_CLOUD_NAME=...
//   CLOUDINARY_API_KEY=...
//   CLOUDINARY_API_SECRET=...

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

