import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";
// Export each, opening object
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();
// 0️⃣ Create rootRouter

rootRouter.get("/", home);
// 1️⃣ Configure rootRouter
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
// 2️⃣ Export rootRouter
