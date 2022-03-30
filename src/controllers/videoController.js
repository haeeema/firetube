import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find();
  res.render("home", { pageTitle: "HOME", videos });
};
// ❗️export each, you can export one thing by <export default>.

export const see = (req, res) => res.render("watch");
export const edit = (req, res) => res.send("Edit");
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
