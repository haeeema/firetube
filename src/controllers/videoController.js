import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

//----------------------------------------------------------------------------------------------------- HOME
export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "HOME", videos });
};
// ❗️export each, you can export one thing by <export default>.

//----------------------------------------------------------------------------------------------------- WATCH
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

//----------------------------------------------------------------------------------------------------- EDIT
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById({ id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

//----------------------------------------------------------------------------------------------------- UPLOAD
export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload video" });

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { location, path } = req.file;
  const { title, description, hashtags } = req.body;
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newVideo = await Video.create({
      title,
      videoUrl: isHeroku ? location : path,
      description,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload video",
      errorMessage: error._message,
    });
  }
};

//----------------------------------------------------------------------------------------------------- DELETE
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

//----------------------------------------------------------------------------------------------------- SEARCH
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};
//----------------------------------------------------------------------------------------------------- VIEW
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};
//----------------------------------------------------------------------------------------------------- RECORD
export const getRecord = (req, res) =>
  res.render("record", { pageTitle: "Record video" });

export const postRecord = (req, res) => {
  return res.send("postRecord");
};
//----------------------------------------------------------------------------------------------------- COMMENTS
export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};
//-----------------------------------------------------------------------------------------------------🔥🔥🔥 Challenge!! #16.9
export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const comment = await Comment.findById(id).populate("video");
  if (String(comment.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  if (!comment) {
    return res.sendStatus(404);
  }
  const videoId = comment.video._id;
  const video = await Video.findById(videoId.toString());
  video.comments = comment.video.comments.filter((comment) => {
    if (comment.toString() !== id) {
      return true;
    }
    return false;
  });
  video.save();
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(201);
};
