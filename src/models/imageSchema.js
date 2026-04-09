import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    imageBase: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true
    },

    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);