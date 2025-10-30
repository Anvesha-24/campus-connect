const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    description: { type: String, required: true },
    fileUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);
