const mongoose = require("mongoose");

const candidateSchema = mongoose.Schema(
  {
    full_name: {
      type: String,
      require: true,
    },
    details: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timeStamp: true,
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);
