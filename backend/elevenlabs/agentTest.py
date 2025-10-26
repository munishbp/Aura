import os
import io
import sys
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
import traceback # For printing detailed errors
load_dotenv()
# Initialize the ElevenLabs client
try:
    client = ElevenLabs(
      api_key=os.getenv("ELEVENLABS_API_KEY")
    )
except Exception as e:
    print(f"Error initializing ElevenLabs client: {e}", file=sys.stderr)
    sys.exit(1)

def transcribe_audio_from_buffer(audio_buffer):
  """Sends audio buffer to ElevenLabs STT API and returns transcript."""
  try:
    response = client.speech_to_text.convert(
        file=audio_buffer, # Pass the in-memory buffer directly
        model_id="scribe_v1" # Use the correct model ID
    )
    if hasattr(response, 'text'):
        return response.text
    else:
        # If the response isn't as expected, print its structure to stderr for debugging
        print(f"some stupid error bruh", file=sys.stderr)
        return None

  except Exception as e:
    print(f"Error during transcription API call: {e}", file=sys.stderr)
    return None

# --- Main execution ---
if __name__ == "__main__":
  try:
    # 1. Read all audio data from standard input
    audio_data = sys.stdin.buffer.read()

    if not audio_data:
        print("Error: No audio data received from stdin.", file=sys.stderr)
        sys.exit(1)

    # 2. Create an in-memory buffer from the received data
    audio_buffer = io.BytesIO(audio_data)

    # 3. Transcribe
    transcript = transcribe_audio_from_buffer(audio_buffer)

    if transcript:
      # --- IMPORTANT: Print *only* the transcript to standard output ---
      print(transcript)
      # ------------------------------------------------------------------
    else:
      # Print error message to standard error so it doesn't pollute stdout
      print("Error: Transcription failed.", file=sys.stderr)
      sys.exit(1) # Exit with error code

  except Exception as e:
      # Print any other unexpected errors to stderr
      print(f"An unexpected error occurred in Python script: {e}", file=sys.stderr)
      # traceback.print_exc(file=sys.stderr)
      sys.exit(1)