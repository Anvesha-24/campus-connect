const multer = require("multer");

// Memory storage instead of disk storage - the file buffer is passed
// directly to Cloudinary (see utils/uploadToCloudinary.js) rather than
// being written to Render's ephemeral local filesystem, which does not
// persist across deploys/restarts on the free tier.
const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload;

