
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Optional because Google users do not need passwords
    password: {
      type: String,
      default: null,
      select: false,
    },

    // Identifies users authenticated through Google
    googleId: {
      type: String,
      default: null,
    },

    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
