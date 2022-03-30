import express from "express";
import {
  getUpload,
  postUpload,
  edit,
  watch,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
// Add URL Parameter, regular expression.
videoRouter.get("/:id([0-9a-f]{24})/edit", edit);
videoRouter.get("/:id([0-9a-f]{24})/remove", deleteVideo);

export default videoRouter;
