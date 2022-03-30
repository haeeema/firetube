import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  // 🔥 <new> when we want to create a new instance of a class.
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, default: true, required: true },
    rating: { type: Number, default: true, required: true },
  },
});
// 1️⃣ Make just shape!!

const Video = mongoose.model("Video", videoSchema);
// 2️⃣ Make model!! here!!
export default Video;
