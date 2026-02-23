// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import express from "npm:express@4.18.2";
import {
  handleChatCompletion,
  handleStreamingChatCompletion,
  handleCompletion,
  listModels,
  getModel,
} from "../_shared/sap/proxy.ts";
import {
  validateSAPConfig,
  PROXY_API_KEY,
  ENABLE_LOGGING,
} from "../_shared/sap/config.ts";
import {
  ChatCompletionRequest,
  CompletionRequest,
  ErrorResponse,
} from "../_shared/openai/types.ts";

const app = express();
const port = 3000;

// Validate SAP AI Core configuration on startup
try {
  validateSAPConfig();
  console.log("[AI Proxy] SAP AI Core configuration validated");
} catch (error) {
  console.error("[AI Proxy] SAP AI Core configuration error:", (error as Error).message);
}

// JSON body parser
app.use('/ai-proxy', express.json({ limit: "10mb" }));

// CORS middleware
app.use('/ai-proxy', (req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  next();
});

// Optional API key authentication middleware
app.use('/ai-proxy/v1', (req: any, res: any, next: any) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  if (PROXY_API_KEY) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: {
          message: "Missing Authorization header",
          type: "invalid_request_error",
          code: "missing_authorization",
        },
      });
    }

    const providedKey = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (providedKey !== PROXY_API_KEY) {
      return res.status(401).json({
        error: {
          message: "Invalid API key",
          type: "invalid_request_error",
          code: "invalid_api_key",
        },
      });
    }
  }

  next();
});

// Request logging middleware
app.use('/ai-proxy', (req: any, res: any, next: any) => {
  if (ENABLE_LOGGING) {
    console.log(`[AI Proxy] ${req.method} ${req.path}`);
  }
  next();
});

// Health check
app.get('/ai-proxy/health', (req: any, res: any) => {
  res.json({ status: "healthy", service: "ai-proxy" });
});

// List models
app.get('/ai-proxy/v1/models', (req: any, res: any) => {
  try {
    const models = listModels();
    res.json(models);
  } catch (error) {
    console.error("[AI Proxy] Error listing models:", error);
    res.status(500).json({
      error: {
        message: (error as Error).message || "Failed to list models",
        type: "server_error",
        code: "internal_error",
      },
    });
  }
});

// Get specific model
app.get('/ai-proxy/v1/models/:modelId', (req: any, res: any) => {
  try {
    const { modelId } = req.params;
    const model = getModel(modelId);
    
    if (!model) {
      return res.status(404).json({
        error: {
          message: `Model '${modelId}' not found`,
          type: "invalid_request_error",
          code: "model_not_found",
        },
      });
    }
    
    res.json(model);
  } catch (error) {
    console.error("[AI Proxy] Error getting model:", error);
    res.status(500).json({
      error: {
        message: (error as Error).message || "Failed to get model",
        type: "server_error",
        code: "internal_error",
      },
    });
  }
});

// Chat completions
app.post('/ai-proxy/v1/chat/completions', async (req: any, res: any) => {
  try {
    const request: ChatCompletionRequest = req.body;

    if (!request.messages || !Array.isArray(request.messages) || request.messages.length === 0) {
      return res.status(400).json({
        error: {
          message: "messages is required and must be a non-empty array",
          type: "invalid_request_error",
          param: "messages",
          code: "invalid_messages",
        },
      });
    }

    if (!request.model) {
      return res.status(400).json({
        error: {
          message: "model is required",
          type: "invalid_request_error",
          param: "model",
          code: "invalid_model",
        },
      });
    }

    if (request.stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      try {
        const stream = await handleStreamingChatCompletion(request);
        const reader = stream.getReader();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        
        res.end();
      } catch (streamError) {
        console.error("[AI Proxy] Streaming error:", streamError);
        if (!res.headersSent) {
          res.status(500).json({
            error: {
              message: (streamError as Error).message || "Streaming failed",
              type: "server_error",
              code: "stream_error",
            },
          });
        } else {
          const errorChunk = `data: ${JSON.stringify({ error: { message: (streamError as Error).message } })}\n\n`;
          res.write(errorChunk);
          res.end();
        }
      }
    } else {
      const response = await handleChatCompletion(request);
      res.json(response);
    }
  } catch (error) {
    console.error("[AI Proxy] Chat completion error:", error);
    res.status(500).json({
      error: {
        message: (error as Error).message || "Failed to process chat completion",
        type: "server_error",
        code: "internal_error",
      },
    });
  }
});

// Legacy completions
app.post('/ai-proxy/v1/completions', async (req: any, res: any) => {
  try {
    const request: CompletionRequest = req.body;

    if (!request.prompt) {
      return res.status(400).json({
        error: {
          message: "prompt is required",
          type: "invalid_request_error",
          param: "prompt",
          code: "invalid_prompt",
        },
      });
    }

    if (!request.model) {
      return res.status(400).json({
        error: {
          message: "model is required",
          type: "invalid_request_error",
          param: "model",
          code: "invalid_model",
        },
      });
    }

    const response = await handleCompletion(request);
    res.json(response);
  } catch (error) {
    console.error("[AI Proxy] Completion error:", error);
    res.status(500).json({
      error: {
        message: (error as Error).message || "Failed to process completion",
        type: "server_error",
        code: "internal_error",
      },
    });
  }
});

// Anthropic-compatible messages endpoint
app.post('/ai-proxy/v1/messages', async (req: any, res: any) => {
  try {
    const anthropicRequest = req.body;

    if (!anthropicRequest.model) {
      return res.status(400).json({
        type: "error",
        error: {
          type: "invalid_request_error",
          message: "model is required",
        },
      });
    }

    const chatRequest: ChatCompletionRequest = {
      model: anthropicRequest.model,
      messages: [],
      max_tokens: anthropicRequest.max_tokens,
      temperature: anthropicRequest.temperature,
      top_p: anthropicRequest.top_p,
      stream: anthropicRequest.stream || false,
    };

    if (anthropicRequest.system) {
      chatRequest.messages.push({
        role: "system",
        content: anthropicRequest.system,
      });
    }

    if (anthropicRequest.messages) {
      for (const msg of anthropicRequest.messages) {
        let content = "";
        if (typeof msg.content === "string") {
          content = msg.content;
        } else if (Array.isArray(msg.content)) {
          content = msg.content
            .filter((c: any) => c.type === "text")
            .map((c: any) => c.text)
            .join("\n");
        }

        chatRequest.messages.push({
          role: msg.role,
          content,
        });
      }
    }

    if (chatRequest.stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await handleStreamingChatCompletion(chatRequest);
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }

      res.end();
    } else {
      const response = await handleChatCompletion(chatRequest);
      
      const anthropicResponse = {
        id: response.id,
        type: "message",
        role: "assistant",
        content: [{
          type: "text",
          text: response.choices[0]?.message?.content || "",
        }],
        model: response.model,
        stop_reason: response.choices[0]?.finish_reason === "stop" ? "end_turn" : response.choices[0]?.finish_reason,
        usage: {
          input_tokens: response.usage.prompt_tokens,
          output_tokens: response.usage.completion_tokens,
        },
      };

      res.json(anthropicResponse);
    }
  } catch (error) {
    console.error("[AI Proxy] Messages error:", error);
    res.status(500).json({
      type: "error",
      error: {
        type: "api_error",
        message: (error as Error).message || "Failed to process message",
      },
    });
  }
});

// 404 handler
app.use('/ai-proxy', (req: any, res: any) => {
  res.status(404).json({
    error: {
      message: `Endpoint not found: ${req.method} ${req.path}`,
      type: "invalid_request_error",
      code: "endpoint_not_found",
    },
  });
});

app.listen(port, () => {
  console.log(`[AI Proxy] Listening on port ${port}`);
  console.log(`[AI Proxy] Available endpoints:`);
  console.log(`  - GET  /ai-proxy/v1/models`);
  console.log(`  - POST /ai-proxy/v1/chat/completions`);
  console.log(`  - POST /ai-proxy/v1/completions`);
  console.log(`  - POST /ai-proxy/v1/messages (Anthropic format)`);
});