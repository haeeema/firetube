import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "HOME", videos });
};
// ❗️export each, you can export one thing by <export default>.

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found" });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  return res.render("edit", { pageTitle: "Edit Video", video });
};

export const postEdit = (req, res) => {
  return res.send("post");
};

export const search = (req, res) => res.send("Search");

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload video" });

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = (req, res) => res.send("Delete");
