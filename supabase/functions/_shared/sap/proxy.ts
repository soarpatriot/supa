/**
 * SAP AI Core Proxy Module
 * Translates OpenAI-compatible requests to SAP AI Core format
 * Handles both streaming and non-streaming responses
 */

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatCompletionChunk,
  ChatMessage,
  CompletionRequest,
  CompletionResponse,
  Model,
  ModelListResponse,
  Usage,
} from "../openai/types.ts";

import {
  SAPChatCompletionRequest,
  SAPChatCompletionResponse,
  SAPChatMessage,
  SAPStreamChunk,
} from "./types.ts";

import { createSAPHeaders, sapFetch } from "./auth.ts";
import {
  SAP_AI_CORE_CONFIG,
  getDeploymentId,
  getAvailableModels,
  ENABLE_LOGGING,
} from "./config.ts";

/**
 * Generate a unique ID for responses
 */
function generateId(prefix: string = "chatcmpl"): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 24; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${id}`;
}

/**
 * Transform OpenAI message format to SAP message format
 */
function transformMessages(messages: ChatMessage[]): SAPChatMessage[] {
  return messages.map(msg => ({
    role: msg.role === "tool" || msg.role === "function" ? "user" : msg.role as "system" | "user" | "assistant",
    content: msg.content || "",
  }));
}

/**
 * Transform OpenAI request to SAP AI Core request format
 */
function transformRequest(request: ChatCompletionRequest): SAPChatCompletionRequest {
  const sapRequest: SAPChatCompletionRequest = {
    messages: transformMessages(request.messages),
  };

  // Map optional parameters
  if (request.max_tokens !== undefined) {
    sapRequest.max_tokens = request.max_tokens;
  }
  if (request.temperature !== undefined) {
    sapRequest.temperature = request.temperature;
  }
  if (request.top_p !== undefined) {
    sapRequest.top_p = request.top_p;
  }
  if (request.n !== undefined) {
    sapRequest.n = request.n;
  }
  if (request.stop !== undefined) {
    sapRequest.stop = request.stop;
  }
  if (request.presence_penalty !== undefined) {
    sapRequest.presence_penalty = request.presence_penalty;
  }
  if (request.frequency_penalty !== undefined) {
    sapRequest.frequency_penalty = request.frequency_penalty;
  }
  if (request.stream !== undefined) {
    sapRequest.stream = request.stream;
  }

  return sapRequest;
}

/**
 * Transform SAP response to OpenAI response format
 */
function transformResponse(
  sapResponse: SAPChatCompletionResponse,
  requestedModel: string
): ChatCompletionResponse {
  return {
    id: sapResponse.id || generateId(),
    object: "chat.completion",
    created: sapResponse.created || Math.floor(Date.now() / 1000),
    model: requestedModel,
    choices: sapResponse.choices.map((choice, index) => ({
      index: choice.index ?? index,
      message: {
        role: choice.message.role as "assistant",
        content: choice.message.content,
      },
      finish_reason: (choice.finish_reason as "stop" | "length" | "tool_calls" | "content_filter" | "function_call") || "stop",
      logprobs: null,
    })),
    usage: sapResponse.usage || {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    },
  };
}

/**
 * Create a streaming chunk in OpenAI format
 */
function createStreamChunk(
  id: string,
  model: string,
  content: string | null,
  role?: string,
  finishReason?: string | null
): ChatCompletionChunk {
  return {
    id,
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{
      index: 0,
      delta: {
        role: role as "assistant" | undefined,
        content: content,
      },
      finish_reason: finishReason as "stop" | "length" | "tool_calls" | "content_filter" | "function_call" | null || null,
      logprobs: null,
    }],
  };
}

/**
 * Normalize model name - handles various formats like:
 * - "anthropic--claude-4.6-opus" -> "claude-4.6-opus"
 * - "claude-4.6-opus" -> "claude-4.6-opus"
 * - "anthropic/claude-4.6-opus" -> "claude-4.6-opus"
 */
function normalizeModelName(modelName: string): string {
  // Remove provider prefixes
  let normalized = modelName.replace(/^(anthropic|openai|google|azure|sap)[\-\/]+/i, "");
  return normalized;
}

/**
 * Detect if model is Anthropic (Claude) based on model name or deployment ID
 */
function isAnthropicModel(modelName: string, deploymentId: string): boolean {
  const normalized = normalizeModelName(modelName);
  return normalized.toLowerCase().includes("claude") || 
         deploymentId.toLowerCase().includes("anthropic") ||
         deploymentId.toLowerCase().includes("claude");
}

/**
 * Get the proper deployment ID, handling model name normalization
 */
function getResolvedDeploymentId(modelName: string): string {
  // First try direct lookup
  let deploymentId = getDeploymentId(modelName);
  
  // If the deployment ID is same as model name (not found), try normalized name
  if (deploymentId === modelName) {
    const normalized = normalizeModelName(modelName);
    if (normalized !== modelName) {
      deploymentId = getDeploymentId(normalized);
    }
  }
  
  return deploymentId;
}

/**
 * Transform request to Anthropic invoke format
 */
function transformToAnthropicInvoke(request: ChatCompletionRequest): object {
  // Extract system message if present
  let systemPrompt = "";
  const messages: Array<{role: string; content: string}> = [];
  
  for (const msg of request.messages) {
    if (msg.role === "system") {
      systemPrompt = msg.content || "";
    } else {
      messages.push({
        role: msg.role,
        content: msg.content || "",
      });
    }
  }
  
  const anthropicRequest: any = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: request.max_tokens || 4096,
    messages: messages,
  };
  
  if (systemPrompt) {
    anthropicRequest.system = systemPrompt;
  }
  
  if (request.temperature !== undefined) {
    anthropicRequest.temperature = request.temperature;
  }
  if (request.top_p !== undefined) {
    anthropicRequest.top_p = request.top_p;
  }
  if (request.stop) {
    anthropicRequest.stop_sequences = Array.isArray(request.stop) ? request.stop : [request.stop];
  }
  
  return anthropicRequest;
}

/**
 * Transform Anthropic invoke response to OpenAI format
 */
function transformAnthropicResponse(
  anthropicResponse: any,
  requestedModel: string
): ChatCompletionResponse {
  const content = anthropicResponse.content?.[0]?.text || "";
  
  return {
    id: anthropicResponse.id || generateId(),
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: requestedModel,
    choices: [{
      index: 0,
      message: {
        role: "assistant",
        content: content,
      },
      finish_reason: anthropicResponse.stop_reason === "end_turn" ? "stop" : 
                     anthropicResponse.stop_reason === "max_tokens" ? "length" : "stop",
      logprobs: null,
    }],
    usage: {
      prompt_tokens: anthropicResponse.usage?.input_tokens || 0,
      completion_tokens: anthropicResponse.usage?.output_tokens || 0,
      total_tokens: (anthropicResponse.usage?.input_tokens || 0) + (anthropicResponse.usage?.output_tokens || 0),
    },
  };
}

/**
 * Handle non-streaming chat completion request
 */
export async function handleChatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  const deploymentId = getResolvedDeploymentId(request.model);
  const isAnthropic = isAnthropicModel(request.model, deploymentId);

  if (ENABLE_LOGGING) {
    console.log(`[Proxy] Model: ${request.model}, Deployment: ${deploymentId}, IsAnthropic: ${isAnthropic}`);
  }

  let endpoint: string;
  let requestBody: string;

  if (isAnthropic) {
    // Use invoke endpoint for Anthropic models
    endpoint = `/v2/inference/deployments/${deploymentId}/invoke`;
    const anthropicRequest = transformToAnthropicInvoke(request);
    requestBody = JSON.stringify(anthropicRequest);
    
    if (ENABLE_LOGGING) {
      console.log("[Proxy] Anthropic invoke request:", requestBody);
    }
  } else {
    // Use chat/completions for OpenAI-compatible models
    endpoint = `/v2/inference/deployments/${deploymentId}/chat/completions`;
    const sapRequest = transformRequest(request);
    requestBody = JSON.stringify(sapRequest);
    
    if (ENABLE_LOGGING) {
      console.log("[Proxy] Chat completion request:", requestBody);
    }
  }

  const response = await sapFetch(endpoint, {
    method: "POST",
    body: requestBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Proxy] SAP AI Core error: ${response.status} ${response.statusText}`);
    console.error(`[Proxy] Error response: ${errorText}`);
    throw new Error(`SAP AI Core error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const responseJson = await response.json();

  if (ENABLE_LOGGING) {
    console.log("[Proxy] Response:", JSON.stringify(responseJson, null, 2));
  }

  if (isAnthropic) {
    return transformAnthropicResponse(responseJson, request.model);
  } else {
    return transformResponse(responseJson, request.model);
  }
}

/**
 * Handle streaming chat completion request
 * Returns a ReadableStream that emits Server-Sent Events
 */
export async function handleStreamingChatCompletion(
  request: ChatCompletionRequest
): Promise<ReadableStream<Uint8Array>> {
  const deploymentId = getResolvedDeploymentId(request.model);
  const isAnthropic = isAnthropicModel(request.model, deploymentId);
  const responseId = generateId();

  if (ENABLE_LOGGING) {
    console.log(`[Proxy] Streaming - Model: ${request.model}, Deployment: ${deploymentId}, IsAnthropic: ${isAnthropic}`);
  }

  let endpoint: string;
  let requestBody: string;
  const headers = await createSAPHeaders();

  if (isAnthropic) {
    // Anthropic models use /invoke endpoint
    // Note: SAP AI Core's Anthropic endpoint may not support streaming
    // Fall back to non-streaming and simulate stream output
    endpoint = `/v2/inference/deployments/${deploymentId}/invoke`;
    const anthropicRequest: any = transformToAnthropicInvoke(request);
    // Don't add stream parameter - SAP AI Core Anthropic doesn't support it
    requestBody = JSON.stringify(anthropicRequest);
    
    if (ENABLE_LOGGING) {
      console.log("[Proxy] Anthropic invoke request (simulated streaming):", requestBody);
    }
  } else {
    // OpenAI-compatible models use /chat/completions
    endpoint = `/v2/inference/deployments/${deploymentId}/chat/completions`;
    const sapRequest = transformRequest({ ...request, stream: true });
    requestBody = JSON.stringify(sapRequest);
    
    if (ENABLE_LOGGING) {
      console.log("[Proxy] Chat streaming request:", requestBody);
    }
  }

  const response = await fetch(`${SAP_AI_CORE_CONFIG.aiApiUrl}${endpoint}`, {
    method: "POST",
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Proxy] SAP AI Core streaming error: ${response.status} ${response.statusText}`);
    console.error(`[Proxy] Error response: ${errorText}`);
    throw new Error(`SAP AI Core error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // Create a transform stream to convert SAP/Anthropic streaming format to OpenAI format
  const transformStream = new TransformStream<Uint8Array, Uint8Array>({
    start(controller) {
      // Send initial chunk with role
      const initialChunk = createStreamChunk(responseId, request.model, null, "assistant", null);
      const sseData = `data: ${JSON.stringify(initialChunk)}\n\n`;
      controller.enqueue(encoder.encode(sseData));
    },
    
    transform(chunk, controller) {
      const text = decoder.decode(chunk, { stream: true });
      const lines = text.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          
          if (data === "[DONE]") {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            return;
          }

          try {
            const parsed = JSON.parse(data);
            
            if (isAnthropic) {
              // Handle Anthropic streaming format
              // Anthropic sends events like: content_block_delta, message_delta, etc.
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                const openAIChunk = createStreamChunk(
                  responseId,
                  request.model,
                  parsed.delta.text,
                  undefined,
                  null
                );
                const sseData = `data: ${JSON.stringify(openAIChunk)}\n\n`;
                controller.enqueue(encoder.encode(sseData));
              } else if (parsed.type === "message_delta" && parsed.delta?.stop_reason) {
                const openAIChunk = createStreamChunk(
                  responseId,
                  request.model,
                  null,
                  undefined,
                  parsed.delta.stop_reason === "end_turn" ? "stop" : parsed.delta.stop_reason
                );
                const sseData = `data: ${JSON.stringify(openAIChunk)}\n\n`;
                controller.enqueue(encoder.encode(sseData));
              } else if (parsed.type === "message_stop") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              }
            } else {
              // Handle OpenAI/SAP streaming format
              const sapChunk: SAPStreamChunk = parsed;
              
              for (const choice of sapChunk.choices) {
                const openAIChunk = createStreamChunk(
                  responseId,
                  request.model,
                  choice.delta.content || null,
                  undefined,
                  choice.finish_reason
                );
                
                const sseData = `data: ${JSON.stringify(openAIChunk)}\n\n`;
                controller.enqueue(encoder.encode(sseData));
              }
            }
          } catch (e) {
            // If parsing fails, might be partial data or different format
            // Try to extract content directly
            if (data && data !== "[DONE]") {
              const openAIChunk = createStreamChunk(responseId, request.model, data, undefined, null);
              const sseData = `data: ${JSON.stringify(openAIChunk)}\n\n`;
              controller.enqueue(encoder.encode(sseData));
            }
          }
        } else if (line.startsWith("event: ") && isAnthropic) {
          // Anthropic uses event: prefix for event types, followed by data:
          // We handle the data in the data: section above
          continue;
        }
      }
    },
    
    flush(controller) {
      // Send final [DONE] marker if not already sent
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
    },
  });

  // For Anthropic, the response is not streamed - simulate streaming from the complete response
  if (isAnthropic) {
    const responseJson = await response.json();
    const content = responseJson.content?.[0]?.text || "";
    
    return new ReadableStream({
      start(controller) {
        // Send initial chunk with role
        const initialChunk = createStreamChunk(responseId, request.model, null, "assistant", null);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialChunk)}\n\n`));
        
        // Send content in chunks to simulate streaming
        const chunkSize = 50; // characters per chunk
        for (let i = 0; i < content.length; i += chunkSize) {
          const textChunk = content.slice(i, i + chunkSize);
          const chunk = createStreamChunk(responseId, request.model, textChunk, undefined, null);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        }
        
        // Send final chunk with finish reason
        const finalChunk = createStreamChunk(responseId, request.model, null, undefined, "stop");
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });
  }

  // Pipe the response body through our transform stream for OpenAI models
  if (response.body) {
    return response.body.pipeThrough(transformStream);
  }

  // If no body, return an empty completed stream
  return new ReadableStream({
    start(controller) {
      const doneChunk = createStreamChunk(responseId, request.model, "", undefined, "stop");
      const sseData = `data: ${JSON.stringify(doneChunk)}\n\ndata: [DONE]\n\n`;
      controller.enqueue(encoder.encode(sseData));
      controller.close();
    },
  });
}

/**
 * Handle legacy completions endpoint
 */
export async function handleCompletion(
  request: CompletionRequest
): Promise<CompletionResponse> {
  // Convert completion request to chat format
  const prompt = Array.isArray(request.prompt) ? request.prompt.join("\n") : request.prompt;
  
  const chatRequest: ChatCompletionRequest = {
    model: request.model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: request.max_tokens,
    temperature: request.temperature,
    top_p: request.top_p,
    n: request.n,
    stop: request.stop,
    presence_penalty: request.presence_penalty,
    frequency_penalty: request.frequency_penalty,
    stream: false,
  };

  const chatResponse = await handleChatCompletion(chatRequest);

  // Convert chat response to completion format
  return {
    id: chatResponse.id.replace("chatcmpl", "cmpl"),
    object: "text_completion",
    created: chatResponse.created,
    model: chatResponse.model,
    choices: chatResponse.choices.map((choice, index) => ({
      text: choice.message.content || "",
      index,
      logprobs: null,
      finish_reason: choice.finish_reason,
    })),
    usage: chatResponse.usage,
  };
}

/**
 * Get list of available models
 */
export function listModels(): ModelListResponse {
  const availableModels = getAvailableModels();
  const now = Math.floor(Date.now() / 1000);

  const models: Model[] = availableModels.map(m => ({
    id: m.id,
    object: "model",
    created: now - 86400 * 365, // Set created date to 1 year ago
    owned_by: m.provider,
  }));

  return {
    object: "list",
    data: models,
  };
}

/**
 * Get a specific model
 */
export function getModel(modelId: string): Model | null {
  const availableModels = getAvailableModels();
  const model = availableModels.find(m => m.id === modelId);
  
  if (!model) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);

  return {
    id: model.id,
    object: "model",
    created: now - 86400 * 365,
    owned_by: model.provider,
  };
}