/**
 * SAP AI Core Type Definitions
 * Types for interacting with SAP AI Core API
 */

// OAuth Token Response
export interface SAPTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  jti: string;
}

// Cached Token with expiry
export interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

// SAP AI Core Configuration
export interface SAPAICoreConfig {
  aiApiUrl: string;
  authUrl: string;
  clientId: string;
  clientSecret: string;
  resourceGroup: string;
}

// SAP AI Core Chat Message
export interface SAPChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// SAP AI Core Chat Completion Request
export interface SAPChatCompletionRequest {
  messages: SAPChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
  presence_penalty?: number;
  frequency_penalty?: number;
}

// SAP AI Core Chat Completion Response
export interface SAPChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: SAPChatChoice[];
  usage: SAPUsage;
}

// SAP Chat Choice
export interface SAPChatChoice {
  index: number;
  message: SAPChatMessage;
  finish_reason: string;
}

// SAP Usage Statistics
export interface SAPUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// SAP Streaming Response Chunk
export interface SAPStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: SAPStreamChoice[];
}

// SAP Stream Choice
export interface SAPStreamChoice {
  index: number;
  delta: {
    role?: string;
    content?: string;
  };
  finish_reason: string | null;
}

// SAP AI Core Deployment
export interface SAPDeployment {
  id: string;
  configurationId: string;
  configurationName: string;
  scenarioId: string;
  status: string;
  statusMessage?: string;
  targetStatus: string;
  lastOperation?: string;
  latestRunningConfigurationId?: string;
  ttl?: string;
  createdAt: string;
  modifiedAt: string;
  startTime?: string;
  completionTime?: string;
  details?: {
    scaling?: {
      backendDetails?: {
        model?: {
          name: string;
          version: string;
        };
      };
    };
    resources?: {
      backendDetails?: {
        model?: {
          name: string;
          version: string;
        };
      };
    };
  };
}

// SAP Deployment List Response
export interface SAPDeploymentListResponse {
  count: number;
  resources: SAPDeployment[];
}

// Model Mapping Configuration
export interface ModelMapping {
  deploymentId: string;
  provider: "openai" | "anthropic" | "google" | "azure" | "sap";
  modelName: string;
  displayName: string;
}

// SAP Error Response
export interface SAPErrorResponse {
  error: {
    code: string;
    message: string;
    requestId?: string;
    target?: string;
    details?: Array<{
      code: string;
      message: string;
    }>;
  };
}

// Proxy Configuration
export interface ProxyConfig {
  sapConfig: SAPAICoreConfig;
  modelMappings: Map<string, ModelMapping>;
  defaultModel: string;
  enableLogging: boolean;
}