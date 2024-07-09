const mongoose = require("mongoose");

const electionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
    duration: {
      type: String,
      require: true,
    },
    conductedBy: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
      default: "Pending",
    },
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("Election", electionSchema);
