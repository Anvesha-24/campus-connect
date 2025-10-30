const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },  // the reply text
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }, // linked question
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who answered
    userName: { type: String, required: true }, // display name of the user
  },
  { timestamps: true }
);

module.exports = mongoose.model("Answer", answerSchema);
