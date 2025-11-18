// utils.ts
export const CONTENT_TYPE_JSON = {
  'Content-Type': 'application/json'
};
export const enforceToken = false; // set to true to enforce token check
export function getEnv(name) {
  return Deno.env.get(name) || '';
}
export function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: CONTENT_TYPE_JSON
  });
}
export function parseRequest(req) {
  const url = new URL(req.url);
  const openid = url.searchParams.get('openid')?.trim() ?? null;
  const internalToken = url.searchParams.get('internal_token') || req.headers.get('x-internal-token') || null;
  return {
    openid,
    internalToken
  };
}
export function checkInternalToken(provided) {
  if (!enforceToken) return true;
  const expected = getEnv('SEARCH_EXPERIENCES_TOKEN') || '';
  return !!expected && provided === expected;
}