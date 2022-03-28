import express from "express";
//0️⃣ === const express = require("express");
import morgan from "morgan";
// morgan: HTTP request logger middlewore for node.js.

const PORT = 4000;

const app = express();
//1️⃣ A top level fuction exported by the express modules.
const logger = morgan("dev");
// "dev" is one of morgan's formats. ex)"combined", "common", ... 

const home = (req, res) => {
    return res.send("HOME");
};
const login = (req, res) => {
    return res.send("LOGIN");
};
//4️⃣ Controller, req(request object) and res(respond object) are given to us by <express>.

app.use(logger);
// Global Router, allow you create "global middlewares" that work any URL. 
// ❗️ORDER: we use global middleware first and then use app.get
app.get("/", home);
app.get("/login", login);
//3️⃣ Router, <get> is http method, After create express application


const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🔥`);

app.listen(PORT, handleListening);
//2️⃣ Create PORT and callback.