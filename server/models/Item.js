const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String, // stores the filename of the uploaded image
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the user who posted
      required: true,
    },
    interestedUsers:[
      {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",  //interested user
    },
  ],
    embedding: {
      type: [Number], // 384-dim sentence embedding for semantic search, generated from title+description
      default: undefined,
      select: false, // don't send this to the client by default, it's large and internal-only
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Item", itemSchema);