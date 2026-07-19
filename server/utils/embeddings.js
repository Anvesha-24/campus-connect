const HF_MODEL_URL =
  "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction";

async function generateEmbedding(text) {
  if (!text || typeof text !== "string" || !text.trim()) {
    return null;
  }

  if (!process.env.HF_API_TOKEN) {
    console.warn("HF_API_TOKEN not set - skipping embedding generation");
    return null;
  }

  try {
    const response = await fetch(HF_MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [text],
        options: { wait_for_model: true },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`HF embedding API error (${response.status}):`, errText);
      return null;
    }

    const result = await response.json();

    if (Array.isArray(result) && Array.isArray(result[0]) && typeof result[0][0] === "number") {
      return result[0];
    }

    if (Array.isArray(result) && typeof result[0] === "number") {
      return result;
    }

    console.error("Unexpected embedding response shape:", JSON.stringify(result).slice(0, 200));
    return null;
  } catch (err) {
    console.error("Embedding generation failed:", err.message);
    return null;
  }
}

module.exports = { generateEmbedding };
