import express from "express";
//0️⃣ === const express = require("express");
import morgan from "morgan";
// morgan: HTTP request logger middlewore for node.js.
import session from "express-session";
// for using session and cookie
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
// import variable in router.js
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
//1️⃣ A top level fuction exported by the express modules.
const logger = morgan("dev");
// "dev" is one of morgan's formats. ex)"combined", "common", ...

app.set("view engine", "pug");
// Express setting: Set view-engine to PUG.
app.set("views", process.cwd() + "/src/views");
// Express setting: change default value.
// ❗️cwd is dir that starts node.
app.use(logger);
// Global Router, allow you create "global middlewares" that work any URL.
// ❗️ORDER: we use global middleware first and then use app.get
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      // Create configuration that has URL of mongo db.
    }),
  })
);
// Start remembering everybody that comes our website.

app.use(localsMiddleware);
// ❗️After session before router
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
// Export connecting init.js
