/**
 * SAP AI Core Authentication Module
 * Handles OAuth2 token acquisition and caching
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SAPTokenResponse, CachedToken, SAPAICoreConfig } from "./types.ts";
import { SAP_AI_CORE_CONFIG } from "./config.ts";

// Token cache with expiry buffer (refresh 5 minutes before expiry)
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000;

// In-memory token cache
let cachedToken: CachedToken | null = null;

/**
 * Get a valid access token for SAP AI Core
 */
export async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken;
  }

  const newToken = await fetchAccessToken(SAP_AI_CORE_CONFIG);
  cachedToken = newToken;
  
  return newToken.accessToken;
}

/**
 * Fetch a new access token from SAP XSUAA
 */
async function fetchAccessToken(config: SAPAICoreConfig): Promise<CachedToken> {
  const tokenUrl = `${config.authUrl}/oauth/token`;
  const credentials = btoa(`${config.clientId}:${config.clientSecret}`);
  
  const body = new URLSearchParams({
    grant_type: "client_credentials",
  });

  console.log(`[SAP Auth] Fetching access token from ${tokenUrl}`);

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[SAP Auth] Token request failed: ${response.status} ${response.statusText}`);
      console.error(`[SAP Auth] Error response: ${errorText}`);
      throw new Error(`Failed to obtain access token: ${response.status} ${response.statusText}`);
    }

    const tokenResponse: SAPTokenResponse = await response.json();
    const expiresAt = Date.now() + (tokenResponse.expires_in * 1000) - TOKEN_EXPIRY_BUFFER_MS;

    console.log(`[SAP Auth] Successfully obtained access token, expires in ${tokenResponse.expires_in} seconds`);

    return {
      accessToken: tokenResponse.access_token,
      expiresAt,
    };
  } catch (error) {
    console.error("[SAP Auth] Error fetching access token:", error);
    throw error;
  }
}

/**
 * Clear the cached token
 */
export function clearTokenCache(): void {
  cachedToken = null;
}

/**
 * Create headers for SAP AI Core API requests
 */
export async function createSAPHeaders(resourceGroup?: string): Promise<Headers> {
  const token = await getAccessToken();
  
  const headers = new Headers({
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "AI-Resource-Group": resourceGroup || SAP_AI_CORE_CONFIG.resourceGroup,
  });
  
  return headers;
}

/**
 * Make an authenticated request to SAP AI Core
 */
export async function sapFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = await createSAPHeaders();
  
  if (options.headers) {
    const providedHeaders = new Headers(options.headers);
    providedHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }
  
  const url = `${SAP_AI_CORE_CONFIG.aiApiUrl}${endpoint}`;
  
  console.log(`[SAP Fetch] ${options.method || "GET"} ${url}`);
  
  return fetch(url, {
    ...options,
    headers,
  });
}