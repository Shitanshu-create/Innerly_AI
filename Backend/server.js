import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

import app from "./app.js";
import connectDB from "./config/database.js";




connectDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
