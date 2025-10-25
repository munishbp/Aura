from elevenlabs import ElevenLabs
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("ELEVENLABS_API_KEY")
agent_id = os.getenv("AGE_NT_ID")

client = ElevenLabs(api_key=api_key)

# Send a message to the agent
response = client.conversational_ai.chat(
    agent_id=agent_id,
    messages=[
        { "role": "user", "content": "Hello Agent! How are you?" }
    ]
)

print("Agent Response:")
print(response.output_text)

# If your agent is a voice agent, play audio
if hasattr(response, "audio"):
    with open("output.mp3", "wb") as f:
        f.write(response.audio)
    print("Audio response saved as output.mp3 ✅")
