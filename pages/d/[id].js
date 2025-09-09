import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DownloadPage() {
  const router = useRouter();
  const { id } = router.query;
  const [count, setCount] = useState(10);

  useEffect(() => {
    if (!id) return;
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(timer);
          window.location.href = `https://pixeldrain.com/api/file/${id}?download`;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [id]);

  if (!id) return <p>Loading...</p>;

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#fff",
      color: "#000",
      flexDirection: "column",
      textAlign: "center"
    }}>
      <h1>Your download will start in {count} seconds</h1>
      <p>If it doesn’t, <a href={`https://pixeldrain.com/api/file/${id}?download`}>click here</a>.</p>
    </div>
  );
}
