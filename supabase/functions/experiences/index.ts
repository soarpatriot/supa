// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from "npm:express@4.18.2";
import { myExperiencesHandler } from './my_experiences.ts';
import { oneExperiencesHandler } from './one_experience.ts';
import { saveExperienceHandler } from './save_experience.ts';
import { updateExperienceHandler } from './update_experience.ts';

const app = express();

app.use('/experiences', express.json())
// If you want a payload larger than 100kb, then you can tweak it here:
// app.use( express.json({ limit : "300kb" }));
const port = 3000

app.get('/experiences', myExperiencesHandler)
app.get('/experiences/:id', oneExperiencesHandler)
app.post('/experiences', saveExperienceHandler)
app.put('/experiences/:id/paid', updateExperienceHandler)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/experiences' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
