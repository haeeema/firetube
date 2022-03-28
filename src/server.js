import express from "express";
//0️⃣ === const express = require("express");

const PORT = 4000;

const app = express();
//1️⃣ A top level fuction exported by the express modules.

const handleHome = (req, res) => {
    return res.send("HOME");
};
const handleLogin = (req, res) => {
    return res.send("LOGIN");
};
//4️⃣ req(request object) and res(respond object) are given to us by <express>.

app.get("/", handleHome);
app.get("/login", handleLogin);
//3️⃣ Router, <get> is http method, After create express application

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🔥`);

app.listen(PORT, handleListening);
//2️⃣ Create PORT and callback.