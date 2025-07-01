import express from "express";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todo.js";
import authMiddleware from "./middleware/auth.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 3005;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
