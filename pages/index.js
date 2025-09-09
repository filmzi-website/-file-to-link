import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);
    setResult(data);
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#0a0f1f",
      color: "#fff",
      flexDirection: "column",
      textAlign: "center"
    }}>
      <h1 style={{ color: "#4cc9f0" }}>Pixeldrain Uploader</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          style={{ marginBottom: 15 }}
        />
        <br />
        <button type="submit" disabled={loading} style={{
          padding: "10px 20px",
          background: "#4cc9f0",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {result && !result.error && (
        <div style={{ marginTop: 20 }}>
          <p><b>Preview:</b> <a href={result.preview} target="_blank">{result.preview}</a></p>
          <p><b>Direct Download:</b> <a href={result.direct} target="_blank">{result.direct}</a></p>
          <p><b>Your Download Page:</b> <a href={result.page} target="_blank">{result.page}</a></p>
        </div>
      )}

      {result && result.error && (
        <p style={{ color: "red", marginTop: 20 }}>Error: {result.error}</p>
      )}
    </div>
  );
}
