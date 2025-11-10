# Gemini Live API Implementation Notes

## Current Implementation

We're using the **direct Google GenAI SDK** (`@google/genai`) rather than Firebase AI Logic.

### Model
- **Current**: `gemini-2.0-flash-live-preview-04-09` (updated per Firebase docs)
- **Previous**: `gemini-2.5-flash-native-audio-preview-09-2025`

### Audio Formats (per Firebase AI Logic docs)
- **Input**: Raw 16-bit PCM audio at 16kHz little-endian ✅
- **Output**: Raw 16-bit PCM audio at 24kHz little-endian ✅

### Video
- Currently sending JPEG frames every 100ms (10 fps)
- Uses `sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } })`

### Session Limits
- **Default session length**: 10 minutes
- **Rate limits**: Varies by usage tier (Gemini Developer API) or 5,000 concurrent sessions (Vertex AI)

## Firebase AI Logic Alternative

If we want to migrate to Firebase AI Logic, we would need to:

1. **Set up Firebase project**
2. **Install Firebase SDK**:
   ```html
   <script type="module">
     import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js';
     import { getAI, getLiveGenerativeModel, GoogleAIBackend, ResponseModality } from 'https://www.gstatic.com/firebasejs/10.x.x/firebase-ai-logic.js';
   </script>
   ```

3. **Initialize**:
   ```javascript
   const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
   const model = getLiveGenerativeModel(ai, {
     model: "gemini-2.0-flash-live-preview-04-09",
     generationConfig: {
       responseModalities: [ResponseModality.AUDIO],
       speechConfig: {
         voiceConfig: {
           prebuiltVoiceConfig: { voiceName: "VOICE_NAME" },
         },
       },
     },
   });
   ```

## Benefits of Current Approach (Direct SDK)

- ✅ No Firebase project required
- ✅ Simpler setup
- ✅ Direct API access
- ✅ Works with existing backend authentication

## Benefits of Firebase AI Logic

- ✅ Integrated with Firebase ecosystem
- ✅ Built-in App Check for abuse prevention
- ✅ Unified SDK across platforms
- ✅ Better production tooling

## References

- [Firebase AI Logic Live API Docs](https://firebase.google.com/docs/ai-logic/live-api?api=dev#before-you-begin)
- [Gemini Developer API](https://ai.google.dev/gemini-api/docs)

