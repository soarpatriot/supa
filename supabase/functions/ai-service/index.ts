// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from "npm:express@4.18.2";
import { analyzeBookWithGemini, generateFlashcardsWithGemini } from "./gemini.ts";
import { getNotebookByNotebooklmId, createNotebook, updateNotebook, getFlashcardsByNotebookId, saveFlashcards } from "./db.ts";
import { generateVideoWithGemini } from "./video.ts";

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
  let filePath: string | null = null;

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Missing required field: prompt"
      });
    }

    const videoResult = await generateVideoWithGemini(prompt);
    filePath = videoResult.filePath;

    // Get file stats for Content-Length
    const fileInfo = await Deno.stat(filePath);

    // Set appropriate headers for video download
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${videoResult.videoPath}"`);
    res.setHeader('Content-Length', fileInfo.size.toString());

    // Stream the video file
    const file = await Deno.open(filePath, { read: true });

    try {
      // Create a readable stream from the file
      const readableStream = file.readable;
      const reader = readableStream.getReader();

      // Stream chunks to response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }

      res.end();
    } finally {
      // Close the file
      file.close();

      // Clean up the temporary file
      try {
        await Deno.remove(filePath);
      } catch (cleanupError) {
        console.warn("Failed to cleanup temp file:", cleanupError);
      }
    }
  } catch (error) {
    console.error("Error generating video:", error);

    // Clean up temp file if it exists
    if (filePath) {
      try {
        await Deno.remove(filePath);
      } catch (cleanupError) {
        console.warn("Failed to cleanup temp file on error:", cleanupError);
      }
    }

    return res.status(500).json({
      error: "Failed to generate video",
      message: error.message
    });
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/gemini-service' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
