import express from "express";
//0️⃣ === const express = require("express");
import morgan from "morgan";
// morgan: HTTP request logger middlewore for node.js.
import globalRouter from "./routers/globalrouter";
// import variable in router.js
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;

const app = express();
//1️⃣ A top level fuction exported by the express modules.
const logger = morgan("dev");
// "dev" is one of morgan's formats. ex)"combined", "common", ... 

app.use(logger);
// Global Router, allow you create "global middlewares" that work any URL. 
// ❗️ORDER: we use global middleware first and then use app.get
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);


const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🔥`);

app.listen(PORT, handleListening);
//2️⃣ Create PORT and callback.