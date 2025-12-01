export const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");

if (!GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is required");
}
