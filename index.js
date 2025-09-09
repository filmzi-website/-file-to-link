import express from "express";
import multer from "multer";
import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";
import { nanoid } from "nanoid";
import path from "path";

const app = express();
const upload = multer({ dest: "temp/" });
const LINKS_FILE = "links.json";

// Load existing links or initialize
let links = {};
if (fs.existsSync(LINKS_FILE)) {
  links = JSON.parse(fs.readFileSync(LINKS_FILE));
}

// Serve frontend
app.use(express.static("public"));
app.use(express.json());

// Upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    const response = await fetch("https://pixeldrain.com/api/file", {
      method: "POST",
      body: form
    });

    const data = await response.json();
    fs.unlinkSync(req.file.path); // remove temp file

    const id = nanoid(6);
    links[id] = { link: `https://pixeldrain.com/u/${data.id}`, name: req.file.originalname };
    fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2));

    res.json({ link: `https://yourdomain.vercel.app/u/${id}` });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Redirect endpoint (direct download)
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  if (!links[id]) return res.status(404).send("File not found");

  const file = links[id];
  // Redirect with forced download
  res.redirect(`${file.link}?download=true`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
