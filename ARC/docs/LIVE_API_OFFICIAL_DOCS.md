# Official Gemini Live API Documentation Notes

## Model
- **Official Model**: `gemini-2.5-flash-native-audio-preview-09-2025`
- This is the model used in the official Live API examples

## Audio Format (per official docs)

### Input Audio
- **Format**: Raw 16-bit PCM
- **Sample Rate**: 16kHz
- **Channels**: Mono (1 channel)
- **Endianness**: Little-endian
- **MIME Type**: `audio/pcm;rate=16000`

### Output Audio
- **Format**: Raw 16-bit PCM
- **Sample Rate**: 24kHz
- **Channels**: Mono (1 channel)
- **Endianness**: Little-endian

## Implementation Approaches

### Client-to-Server (Recommended for streaming)
- Frontend connects directly to Live API via WebSockets
- Better performance for audio/video streaming
- Bypasses backend for streaming data
- **Security**: Use ephemeral tokens instead of API keys in production

### Server-to-Server
- Backend connects to Live API via WebSockets
- Client sends stream data to server, server forwards to API
- More secure but adds latency

## Official Python Example

```python
import asyncio
from google import genai
from google.genai import types

client = genai.Client()

model = "gemini-2.5-flash-native-audio-preview-09-2025"

config = {
  "response_modalities": ["AUDIO"],
  "system_instruction": "You are a helpful assistant and answer in a friendly tone.",
}

async def main():
    async with client.aio.live.connect(model=model, config=config) as session:
        # Send audio
        await session.send_realtime_input(
            audio=types.Blob(data=audio_bytes, mime_type="audio/pcm;rate=16000")
        )
        
        # Receive audio
        async for response in session.receive():
            if response.data is not None:
                # Process audio data (24kHz output)
                wf.writeframes(response.data)
```

## JavaScript SDK Differences

The JavaScript SDK uses a slightly different API:
- `sendRealtimeInput({ media: blob })` instead of `send_realtime_input(audio=...)`
- Uses callbacks (`onmessage`, `onopen`, etc.) instead of async iterators
- Blob mime type should be `audio/pcm;rate=16000`

## Key Features

- **Voice Activity Detection (VAD)**: Enabled by default
- **Session Management**: For long-running conversations
- **Ephemeral Tokens**: For secure client-side authentication
- **Tool Use**: Function calling support
- **Multimodal**: Supports audio, video, and text

## Session Limits

- **Default Length**: 10 minutes
- **Rate Limits**: Varies by usage tier
- **Concurrent Sessions**: Limited per project

## References

- [Official Live API Docs](https://ai.google.dev/gemini-api/docs/live)
- [Live API Python Cookbook](https://github.com/google/generative-ai-python/tree/main/examples/live_api)
- [Live Audio Starter App](https://aistudio.google.com/app/prompts/live_audio_starter)

