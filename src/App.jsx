import { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setImg(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setImg(`data:${data.mimeType};base64,${data.imageBase64}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 1000, margin: "2rem auto", padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Gemini Nano Banana – Image Generator</h1>

      <form onSubmit={generate} style={{ display: "grid", gap: 12 }}>
        <label>
          Prompt
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            style={{ width: "100%" }}
          />
        </label>
        <button style={{width: "200px"}} disabled={loading}>{loading ? "Generating..." : "Generate image"}</button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {img && (
        <div style={{ marginTop: 16 }}>
          <img src={img} alt="Generated" style={{ width: "100%", borderRadius: 8 }} />
          <a href={img} download="gemini-image.png">Download</a>
        </div>
      )}
    </main>
  );
}
