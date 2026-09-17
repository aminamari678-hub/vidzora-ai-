export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(
      "https://api.replicate.com/v1/models/minimax/video-01/predictions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: {
            prompt: prompt,
            prompt_optimizer: true
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.detail || data.error || "Replicate API error"
      });
    }

    return res.status(200).json({
      id: data.id,
      status: data.status,
      output: data.output || null
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
