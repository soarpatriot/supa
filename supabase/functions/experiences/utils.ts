// utils.ts
export const CONTENT_TYPE_JSON = {
  'Content-Type': 'application/json'
};
export const enforceToken = false; // set to true to enforce token check

export function getEnv(name: string): string {
  return Deno.env.get(name) || '';
}

export function jsonResponse(body: any, status: number = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: CONTENT_TYPE_JSON
  });
}

export function parseRequest(req: Request) {
  const url = new URL(req.url);
  const openid = url.searchParams.get('openid')?.trim() ?? null;
  const internalToken = url.searchParams.get('internal_token') || req.headers.get('x-internal-token') || null;
  return {
    openid,
    internalToken
  };
}

export function checkInternalToken(provided: string | null): boolean {
  if (!enforceToken) return true;
  const expected = getEnv('SEARCH_EXPERIENCES_TOKEN') || '';
  return !!expected && provided === expected;
}