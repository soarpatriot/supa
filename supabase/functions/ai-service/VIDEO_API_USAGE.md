# Video Generation API Usage

## Overview
The video generation API has been enhanced to support optional `model` and `config` parameters, providing more flexibility in video generation.

## API Endpoint
```
POST /ai-service/videos
```

## Request Parameters

### Required Parameters
- **prompt** (string): The text description of the video you want to generate

### Optional Parameters
- **model** (string): The AI model to use for video generation
  - Default: `"veo-3.1-generate-preview"`
  - You can specify other compatible models as needed

- **config** (object): Configuration options for video generation
  - **aspectRatio** (string): The aspect ratio of the generated video (e.g., "16:9", "9:16", "1:1")
  - **negativePrompt** (string): Things you want to avoid in the generated video

## Example Requests

### Basic Request (using defaults)
```json
{
  "prompt": "A cinematic shot of a majestic lion in the savannah."
}
```

### Request with Custom Model
```json
{
  "prompt": "A cinematic shot of a majestic lion in the savannah.",
  "model": "veo-3.1-generate-preview"
}
```

### Request with Full Configuration
```json
{
  "prompt": "A cinematic shot of a majestic lion in the savannah.",
  "model": "veo-3.1-generate-preview",
  "config": {
    "aspectRatio": "16:9",
    "negativePrompt": "cartoon, drawing, low quality"
  }
}
```

### Request with Only Config (using default model)
```json
{
  "prompt": "A serene beach at sunset with waves crashing",
  "config": {
    "aspectRatio": "9:16",
    "negativePrompt": "people, buildings, text"
  }
}
```

## Response Format
```json
{
  "success": true,
  "data": {
    "videoUrl": "https://your-storage-url.com/videos/generated_video_1234567890.mp4",
    "storagePath": "videos/generated_video_1234567890.mp4",
    "prompt": "A cinematic shot of a majestic lion in the savannah.",
    "operation": {
      "name": "operation-name",
      "done": true,
      "metadata": {}
    }
  }
}
```

## Error Response
```json
{
  "error": "Failed to generate video",
  "message": "Detailed error message"
}
```

## cURL Examples

### Basic Request
```bash
curl -X POST http://localhost:3000/ai-service/videos \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A cinematic shot of a majestic lion in the savannah."
  }'
```

### Request with Configuration
```bash
curl -X POST http://localhost:3000/ai-service/videos \
  -H "Content-Type: application/json" \
  -H "authorization: Bearer xxxxxx" \
  -d '{
    "prompt": "A cinematic shot of a majestic lion in the savannah.",
    "model": "veo-3.1-generate-preview",
    "config": {
      "aspectRatio": "16:9",
      "negativePrompt": "cartoon, drawing, low quality"
    }
  }'
```

## Notes
- Video generation is an asynchronous process that may take several minutes
- The API polls the generation status every 10 seconds until completion
- Generated videos are automatically uploaded to Supabase storage
- Temporary files are cleaned up after upload
- The default model `"veo-3.1-generate-preview"` is used when no model is specified
