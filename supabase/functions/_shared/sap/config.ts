/**
 * SAP AI Core Shared Configuration
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SAPAICoreConfig, ModelMapping } from "./types.ts";
import modelsConfig from "./models.json" with { type: "json" };

// SAP AI Core Configuration from environment variables
export const SAP_AI_CORE_CONFIG: SAPAICoreConfig = {
  aiApiUrl: Deno.env.get("SAP_AI_CORE_URL") || "https://api.ai.intprod-eu12.eu-central-1.aws.ml.hana.ondemand.com",
  authUrl: Deno.env.get("SAP_AI_CORE_AUTH_URL") || "https://ai-sk3snjkq.authentication.eu12.hana.ondemand.com",
  clientId: Deno.env.get("SAP_AI_CORE_CLIENT_ID") || "",
  clientSecret: Deno.env.get("SAP_AI_CORE_CLIENT_SECRET") || "",
  resourceGroup: Deno.env.get("SAP_AI_CORE_RESOURCE_GROUP") || "default",
};

// Validate SAP AI Core configuration
export function validateSAPConfig(): void {
  if (!SAP_AI_CORE_CONFIG.clientId) {
    throw new Error("SAP_AI_CORE_CLIENT_ID environment variable is required");
  }
  if (!SAP_AI_CORE_CONFIG.clientSecret) {
    throw new Error("SAP_AI_CORE_CLIENT_SECRET environment variable is required");
  }
}

// Load model mappings from models.json
function loadModelMappings(): Map<string, ModelMapping> {
  const mappings = new Map<string, ModelMapping>();
  const models = modelsConfig.models as Record<string, { deploymentId: string; provider: string; displayName: string }>;
  
  for (const [modelName, config] of Object.entries(models)) {
    mappings.set(modelName, {
      deploymentId: config.deploymentId,
      provider: config.provider as "openai" | "anthropic" | "google" | "azure" | "sap",
      modelName: modelName,
      displayName: config.displayName,
    });
  }
  
  return mappings;
}

// Export model mappings
export const MODEL_MAPPINGS = loadModelMappings();

// Enable request/response logging
export const ENABLE_LOGGING = Deno.env.get("SAP_ENABLE_LOGGING") === "true";

// API Key for authenticating clients (optional)
export const PROXY_API_KEY = Deno.env.get("PROXY_API_KEY");

// Get deployment ID for a given model name
export function getDeploymentId(modelName: string): string {
  const mapping = MODEL_MAPPINGS.get(modelName);
  if (mapping) {
    return mapping.deploymentId;
  }
  return modelName;
}

// Get all available models
export function getAvailableModels(): Array<{ id: string; provider: string; displayName: string }> {
  const models: Array<{ id: string; provider: string; displayName: string }> = [];
  const seen = new Set<string>();
  
  for (const [id, mapping] of MODEL_MAPPINGS) {
    if (!seen.has(mapping.deploymentId)) {
      models.push({
        id,
        provider: mapping.provider,
        displayName: mapping.displayName,
      });
      seen.add(mapping.deploymentId);
    }
  }
  
  return models;
}