import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  datePosted: {
    type: Date,
    required: true,
    default: new Date().toISOString(),
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [],
  content: {
    type: String,
    required: true,
  },
});

const postModel = mongoose.model("Post", postSchema);

export default postModel;
