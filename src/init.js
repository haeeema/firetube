import "regenerator-runtime";
import "dotenv/config";
// ❗️to read .env file
import "./db";
import "./models/Video";
// We don't use model now! It is pre-load, 1. Compile 2. then use when we need
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4000;

const handleListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT} 🔥`);

app.listen(PORT, handleListening);
//2️⃣ Create PORT and callback.
