import express from "express";
import { join, login } from "../controllers/userController";
import { trending, search } from "../controllers/videoController";
// Export each, opening object

const globalRouter = express.Router();
// 0️⃣ Create globalRouter

globalRouter.get("/", trending);
// 1️⃣ Configure globalRouter
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;
// 2️⃣ Export globalRouter