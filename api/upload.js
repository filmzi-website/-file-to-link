import fs from "fs";
import path from "path";
import FormData from "form-data";
import fetch from "node-fetch";
import multer from "multer";

const upload = multer({ dest: "/tmp" });

export const config = {
  api: {
    bodyParser: false, // disable default body parsing
  },
};

export default function handler(req, res) {
  if (req.method === "POST") {
    upload.single("file")(req, res, async (err) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      try {
        const form = new FormData();
        form.append("file", fs.createReadStream(req.file.path));

        const response = await fetch("https://pixeldrain.com/api/file", {
          method: "POST",
          body: form,
        });

        const data = await response.json();
        fs.unlinkSync(req.file.path); // cleanup temp

        // Return direct download link
        res.json({
          link: `https://pixeldrain.com/api/file/${data.id}?download`,
          preview: `https://pixeldrain.com/u/${data.id}`,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
