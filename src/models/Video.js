import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  // 🔥 <new> when we want to create a new instance of a class.
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});
// 1️⃣ Make just shape!!

const Video = mongoose.model("Video", videoSchema);
// 2️⃣ Make model!! here!!
export default Video;
