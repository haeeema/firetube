import express from "express";
import {
  getUpload,
  postUpload,
  getEdit,
  postEdit,
  watch,
  deleteVideo,
  getRecord,
  postRecord,
} from "../controllers/videoController";
import { protectorMiddleware, multerVideoMiddleware } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
// Add URL Parameter, regular expression.
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", protectorMiddleware, deleteVideo);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(multerVideoMiddleware.single("video"), postUpload);
videoRouter
  .route("/record")
  .all(protectorMiddleware)
  .get(getRecord)
  .post(postRecord);

export default videoRouter;
