import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";
import multer from "multer";

const upload = multer({ dest: "/tmp" });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method === "POST") {
    upload.single("file")(req, res, async (err) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      try {
        const form = new FormData();
        form.append("file", fs.createReadStream(req.file.path), req.file.originalname);

        const response = await fetch("https://pixeldrain.com/api/file", {
          method: "POST",
          body: form,
        });

        const data = await response.json();
        fs.unlinkSync(req.file.path);

        if (!data.id) {
          return res.status(500).json({ error: "Pixeldrain upload failed" });
        }

        res.json({
          id: data.id,
          preview: `https://pixeldrain.com/u/${data.id}`,
          direct: `https://pixeldrain.com/api/file/${data.id}?download`,
          page: `/d/${data.id}`
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
