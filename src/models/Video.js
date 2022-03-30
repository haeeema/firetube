import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  // 🔥 <new> when we want to create a new instance of a class.
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});
// 1️⃣ Make just shape!!

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
// 2️⃣ Make model!! here!!

export default Video;
