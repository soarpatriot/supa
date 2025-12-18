// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from "npm:express@4.18.2";
import { analyzeBookWithGemini, generateFlashcardsWithGemini } from "./gemini.ts";
import { getNotebookByNotebooklmId, createNotebook, updateNotebook, getFlashcardsByNotebookId, saveFlashcards } from "./db.ts";
import { generateVideoWithGemini, generateAndStreamVideo } from "./video.ts";

const app = express();

app.use('/ai-service', express.json())
// If you want a payload larger than 100kb, then you can tweak it here:
// app.use( express.json({ limit : "300kb" }));
const port = 3000

app.post('/ai-service/book', async (req, res) => {
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
      message: error.message
    });
  }
})

app.post('/ai-service/notebook/card', async (req, res) => {
  try {
    const { content, count } = req.body;

    if (!content) {
      return res.status(400).json({
        error: "Missing required field: content"
      });
    }

    const cardCount = count && count > 0 ? count : 5;
    const flashcards = await generateFlashcardsWithGemini(content, cardCount);

    return res.status(200).json({
      success: true,
      data: flashcards
    });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return res.status(500).json({
      error: "Failed to generate flashcards",
      message: error.message
    });
  }
})

// Create or update notebook and generate flashcards
app.post('/ai-service/notebook/:notebookId/card', async (req, res) => {
  try {
    const { notebookId } = req.params;
    const { title, content, description, count } = req.body;

    if (!notebookId) {
      return res.status(400).json({
        error: "Missing required parameter: notebookId"
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        error: "Missing required fields: title and content"
      });
    }

    // Check if notebook exists
    let notebook = await getNotebookByNotebooklmId(notebookId);

    if (notebook) {
      // Update existing notebook
      notebook = await updateNotebook(notebookId, title, content, description);
    } else {
      // Create new notebook
      notebook = await createNotebook(notebookId, title, content, description);
    }

    // Generate flashcards
    const cardCount = count && count > 0 ? count : 5;
    const flashcardResult = await generateFlashcardsWithGemini(content, cardCount);

    // Save flashcards to database
    const savedCards = await saveFlashcards(notebook.id, flashcardResult.cards);

    return res.status(200).json({
      success: true,
      data: {
        notebook: notebook,
        flashcards: savedCards
      }
    });
  } catch (error) {
    console.error("Error generating flashcards for notebook:", error);
    return res.status(500).json({
      error: "Failed to generate flashcards for notebook",
      message: error.message
    });
  }
})

// Get flashcards for a notebook
app.get('/ai-service/notebook/:notebookId/cards', async (req, res) => {
  try {
    const { notebookId } = req.params;

    if (!notebookId) {
      return res.status(400).json({
        error: "Missing required parameter: notebookId"
      });
    }

    // Get notebook
    const notebook = await getNotebookByNotebooklmId(notebookId);

    if (!notebook) {
      return res.status(404).json({
        error: "Notebook not found"
      });
    }

    // Get flashcards
    const flashcards = await getFlashcardsByNotebookId(notebook.id);

    return res.status(200).json({
      success: true,
      data: {
        notebook: notebook,
        flashcards: flashcards
      }
    });
  } catch (error) {
    console.error("Error retrieving flashcards:", error);
    return res.status(500).json({
      error: "Failed to retrieve flashcards",
      message: error.message
    });
  }
})

// Generate video from prompt
app.post('/ai-service/videos', async (req, res) => {
  try {
    const { prompt, model, config } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Missing required field: prompt"
      });
    }

    // Use default model "veo-2.0-generate-001" if not provided
    const videoResult = await generateVideoWithGemini(
      prompt,
      model,
      config
    );

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
      message: error.message
    });
  }
})

// Generate and stream a single video
app.post('/ai-service/one-video', async (req, res) => {
  let cleanup: (() => Promise<void>) | null = null;

  try {
    const { prompt, model, config } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Missing required field: prompt"
      });
    }

    // Generate video and get the file path
    const result = await generateAndStreamVideo(
      prompt,
      model,
      config
    );

    cleanup = result.cleanup;

    // Get file stats for content length
    const fileInfo = await Deno.stat(result.filePath);

    // Set appropriate headers for video streaming
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', fileInfo.size.toString());
    res.setHeader('Content-Disposition', 'inline; filename="generated_video.mp4"');

    // Open the file and create a readable stream
    const file = await Deno.open(result.filePath, { read: true });

    // Create a Node.js readable stream from the Deno file
    const readableStream = file.readable;

    // Pipe the stream to the response
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

      // Clean up the temporary file
      if (cleanup) {
        await cleanup();
      }
    }
  } catch (error) {
    console.error("Error generating and streaming video:", error);

    // Clean up if error occurs
    if (cleanup) {
      try {
        await cleanup();
      } catch (cleanupError) {
        console.warn("Failed to cleanup after error:", cleanupError);
      }
    }

    return res.status(500).json({
      error: "Failed to generate and stream video",
      message: error.message
    });
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
