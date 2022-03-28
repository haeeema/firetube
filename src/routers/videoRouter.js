import express from "express";
import { edit, see, upload, deleteVideo } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", see);
// Add URL Parameter, regular expression.
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/remove", deleteVideo);

export default videoRouter;