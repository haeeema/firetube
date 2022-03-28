import express from "express";

const globalRouter = express.Router();
// 0️⃣ Create globalRouter
const handleHome = (req, res) => res.send("Home");

globalRouter.get("/", handleHome);
// 1️⃣ Configure globalRouter

export default globalRouter;
// 2️⃣ export globalRouter