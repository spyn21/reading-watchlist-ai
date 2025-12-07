const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: "2mb" }));

app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    // Clean the prompt text
    const promptText = text.trim().replace(/\s+/g, " ");
    
    // Spawn llama-cli process
    const llamaProcess = spawn("llama-cli", [
      "chat",
      "--model",
      "llama-2-7b-chat.gguf",
      "--prompt",
      `Summarize this text in 2-3 sentences: ${promptText}`,
    ]);

    let output = "";
    let errorOutput = "";

    llamaProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    llamaProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    llamaProcess.on("close", (code) => {
      if (code === 0) {
        // Extract the summary from llama-cli output
        const summary = output.trim().split("\n").pop() || "Summary not available";
        res.json({ summary });
      } else {
        res.status(500).json({ 
          error: "Failed to generate summary",
          details: errorOutput 
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});