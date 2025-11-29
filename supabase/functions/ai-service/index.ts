// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from "npm:express@4.18.2";
import { analyzeBookWithGemini, generateFlashcardsWithGemini } from "./gemini.ts";

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
