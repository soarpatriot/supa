/**
 * OpenAI API Compatible Type Definitions
 * These types enable compatibility with OpenAI SDK clients
 */

// Chat Completion Message Roles
export type ChatRole = "system" | "user" | "assistant" | "tool" | "function";

// Chat Message
export interface ChatMessage {
  role: ChatRole;
  content: string | null;
  name?: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  function_call?: FunctionCall;
}

// Tool Call
export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

// Function Call (legacy)
export interface FunctionCall {
  name: string;
  arguments: string;
}

// Chat Completion Request
export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  user?: string;
  tools?: Tool[];
  tool_choice?: "none" | "auto" | "required" | ToolChoice;
  functions?: FunctionDefinition[];
  function_call?: "none" | "auto" | { name: string };
  response_format?: ResponseFormat;
  seed?: number;
}

// Tool Definition
export interface Tool {
  type: "function";
  function: FunctionDefinition;
}

// Function Definition
export interface FunctionDefinition {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

// Tool Choice
export interface ToolChoice {
  type: "function";
  function: {
    name: string;
  };
}

// Response Format
export interface ResponseFormat {
  type: "text" | "json_object";
}

// Chat Completion Response
export interface ChatCompletionResponse {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage: Usage;
  system_fingerprint?: string;
}

// Chat Completion Choice
export interface ChatCompletionChoice {
  index: number;
  message: ChatMessage;
  finish_reason: FinishReason;
  logprobs?: null;
}

// Finish Reason
export type FinishReason = "stop" | "length" | "tool_calls" | "content_filter" | "function_call" | null;

// Usage Statistics
export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// Streaming Chat Completion Response
export interface ChatCompletionChunk {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: ChatCompletionChunkChoice[];
  system_fingerprint?: string;
}

// Streaming Chat Completion Choice
export interface ChatCompletionChunkChoice {
  index: number;
  delta: ChatCompletionDelta;
  finish_reason: FinishReason;
  logprobs?: null;
}

// Delta for streaming
export interface ChatCompletionDelta {
  role?: ChatRole;
  content?: string | null;
  tool_calls?: ToolCallChunk[];
  function_call?: FunctionCallChunk;
}

// Tool Call Chunk for streaming
export interface ToolCallChunk {
  index: number;
  id?: string;
  type?: "function";
  function?: {
    name?: string;
    arguments?: string;
  };
}

// Function Call Chunk for streaming
export interface FunctionCallChunk {
  name?: string;
  arguments?: string;
}

// Legacy Completion Request
export interface CompletionRequest {
  model: string;
  prompt: string | string[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  logprobs?: number;
  echo?: boolean;
  stop?: string | string[];
  presence_penalty?: number;
  frequency_penalty?: number;
  best_of?: number;
  logit_bias?: Record<string, number>;
  user?: string;
  suffix?: string;
}

// Legacy Completion Response
export interface CompletionResponse {
  id: string;
  object: "text_completion";
  created: number;
  model: string;
  choices: CompletionChoice[];
  usage: Usage;
}

// Legacy Completion Choice
export interface CompletionChoice {
  text: string;
  index: number;
  logprobs: null;
  finish_reason: FinishReason;
}

// Model Object
export interface Model {
  id: string;
  object: "model";
  created: number;
  owned_by: string;
  permission?: ModelPermission[];
  root?: string;
  parent?: string;
}

// Model Permission
export interface ModelPermission {
  id: string;
  object: "model_permission";
  created: number;
  allow_create_engine: boolean;
  allow_sampling: boolean;
  allow_logprobs: boolean;
  allow_search_indices: boolean;
  allow_view: boolean;
  allow_fine_tuning: boolean;
  organization: string;
  group?: string;
  is_blocking: boolean;
}

// Model List Response
export interface ModelListResponse {
  object: "list";
  data: Model[];
}

// Error Response
export interface ErrorResponse {
  error: {
    message: string;
    type: string;
    param?: string;
    code?: string;
  };
}