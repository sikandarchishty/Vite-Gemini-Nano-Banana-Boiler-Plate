// server.js (ESM)
import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ✅ New SDK client (no getGenerativeModel)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Stable model name (aka Nano Banana)
const MODEL = "gemini-2.5-flash-image";

app.post("/api/generate", async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt || "A cozy reading nook under fairy lights",
        });

        // Extract first inline image from the response
        let base64, mimeType;
        for (const cand of response.candidates ?? []) {
            for (const part of cand.content?.parts ?? []) {
                if (part.inlineData?.data) {
                    base64 = part.inlineData.data;
                    mimeType = part.inlineData.mimeType || "image/png";
                    break;
                }
            }
            if (base64) break;
        }

        if (!base64) {
            return res.status(400).json({ error: "No image returned. Try another prompt." });
        }

        res.json({ imageBase64: base64, mimeType });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: String(err) });
    }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
