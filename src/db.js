import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/firetube");

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

db.on("error", handleError);
// <on> is every time, checking part
db.once("open", handleOpen);
// <once> is one time
