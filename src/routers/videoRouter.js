import express from "express";
import {
  getUpload,
  postUpload,
  edit,
  see,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/:id(\\d+)", see);
// Add URL Parameter, regular expression.
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/remove", deleteVideo);

export default videoRouter;
