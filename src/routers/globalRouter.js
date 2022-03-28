import express from "express";
import { join } from "../controllers/userController";
import { trending } from "../controllers/videoController";

const globalRouter = express.Router();
// 0️⃣ Create globalRouter

globalRouter.get("/", trending);
// 1️⃣ Configure globalRouter
globalRouter.get("/join", join);

export default globalRouter;
// 2️⃣ export globalRouter