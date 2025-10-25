const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");
const dotenv = require("dotenv");
dotenv.config();

console.log("API KEY PRESENT:", !!process.env.ELEVENLABS_API_KEY);
console.log("AGENT ID:", process.env.AGENT_ID);

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

async function run() {
  try {
    const response = await client.conversationalAI.chat({
      agentId: process.env.AGENT_ID,
      messages: [
        { role: "user", content: "Hi there! Can you hear me?" }
      ]
    });

    console.log("AI Response:", response.outputText);
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
