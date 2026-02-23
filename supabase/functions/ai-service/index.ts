// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from "npm:express@4.18.2";
import { analyzeBookWithGemini } from "./gemini.ts";
import { generateVideoWithGemini, generateAndStreamVideo } from "./video.ts";
import { ENABLE_LOGGING } from "./config.ts";

const app = express();
const port = 3000;

// JSON body parser
app.use('/ai-service', express.json({ limit: "10mb" }));

// CORS middleware
app.use('/ai-service', (req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

// Request logging middleware
app.use('/ai-service', (req: any, res: any, next: any) => {
  if (ENABLE_LOGGING) {
    console.log(`[AI Service] ${req.method} ${req.path}`);
  }
  next();
});

// ========== Original AI Service Endpoints ==========

// Book analysis endpoint
app.post('/ai-service/book', async (req: any, res: any) => {
  try {
    const { title, author } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        error: "Missing required fields: title and author"
      });
    }

    const analysis = await analyzeBookWithGemini(title, author);

    return res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error("Error analyzing book:", error);
    return res.status(500).json({
      error: "Failed to analyze book",
      message: (error as Error).message
    });
  }
});

// Generate video from prompt
app.post('/ai-service/videos', async (req: any, res: any) => {
  try {
    const { prompt, model, config } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Missing required field: prompt"
      });
    }

    const videoResult = await generateVideoWithGemini(prompt, model, config);

    return res.status(200).json({
      success: true,
      data: {
        videoUrl: videoResult.videoUrl,
        storagePath: videoResult.storagePath,
        prompt: videoResult.prompt,
        operation: videoResult.operation
      }
    });
  } catch (error) {
    console.error("Error generating video:", error);

    return res.status(500).json({
      error: "Failed to generate video",
      message: (error as Error).message
    });
  }
});

// Generate and stream a single video
app.post('/ai-service/one-video', async (req: any, res: any) => {
  let cleanup: (() => Promise<void>) | null = null;

  try {
    const { prompt, model, config } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Missing required field: prompt"
      });
    }

    const result = await generateAndStreamVideo(prompt, model, config);

    cleanup = result.cleanup;

    const fileInfo = await Deno.stat(result.filePath);

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', fileInfo.size.toString());
    res.setHeader('Content-Disposition', 'inline; filename="generated_video.mp4"');

    const file = await Deno.open(result.filePath, { read: true });
    const readableStream = file.readable;
    const reader = readableStream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } finally {
      reader.releaseLock();
      file.close();

      if (cleanup) {
        await cleanup();
      }
    }
  } catch (error) {
    console.error("Error generating and streaming video:", error);

    if (cleanup) {
      try {
        await cleanup();
      } catch (cleanupError) {
        console.warn("Failed to cleanup after error:", cleanupError);
      }
    }

    return res.status(500).json({
      error: "Failed to generate and stream video",
      message: (error as Error).message
    });
  }
});

// 404 handler
app.use('/ai-service', (req: any, res: any) => {
  res.status(404).json({
    error: {
      message: `Endpoint not found: ${req.method} ${req.path}`,
      type: "invalid_request_error",
      code: "endpoint_not_found",
    },
  });
});

app.listen(port, () => {
  console.log(`[AI Service] Listening on port ${port}`);
  console.log(`[AI Service] Available endpoints:`);
  console.log(`  - POST /ai-service/book (analyze book)`);
  console.log(`  - POST /ai-service/videos (generate video)`);
  console.log(`  - POST /ai-service/one-video (stream video)`);
});
