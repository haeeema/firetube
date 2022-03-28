import express from "express";
//0️⃣=== const express = require("express");

const PORT = 4000;

const app = express();
//1️⃣ A top level fuction exported by the express modules.

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT} 🔥`);

app.listen(PORT, handleListening);
//2️⃣ Create PORT and callback.