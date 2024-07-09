const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    full_name: {
      type: String,
      require: true,
    },
    matric: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    gender: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    userType: {
      type: String,
      require: true,
      default: "",
    },
    faceId: {
      type: String,
      // unique: true,
    },
    image: {
      type: String,
      default:
        "https://chcclynden.org/wp-content/uploads/2014/03/placeholder-person.png",
    },
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
