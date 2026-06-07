import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/data", (req, res) => {
  res.sendFile(path.join(__dirname, "data.json"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
