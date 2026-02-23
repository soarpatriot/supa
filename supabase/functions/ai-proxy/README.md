# SAP AI Core Proxy - OpenAI Compatible API

This Supabase Edge Function provides an **OpenAI-compatible API** that proxies requests to **SAP AI Core**. It allows you to use any OpenAI SDK or compatible client to access AI models deployed on SAP AI Core.

## Features

- ✅ **OpenAI API Compatible** - Works with any OpenAI SDK (Python, Node.js, etc.)
- ✅ **Claude Code Compatible** - Use with Claude/Anthropic SDKs
- ✅ **Multi-Provider Support** - Access GPT, Claude, Gemini models through SAP AI Core
- ✅ **Streaming Support** - Full support for Server-Sent Events streaming
- ✅ **Token Authentication** - Automatic OAuth2 token management with SAP XSUAA
- ✅ **Model Aliasing** - Map friendly model names to SAP deployment IDs

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ai-proxy/v1/models` | List available models |
| GET | `/ai-proxy/v1/models/:id` | Get specific model info |
| POST | `/ai-proxy/v1/chat/completions` | Chat completions (streaming & non-streaming) |
| POST | `/ai-proxy/v1/completions` | Legacy text completions |
| POST | `/ai-proxy/v1/messages` | Anthropic-compatible messages endpoint |
| GET | `/ai-proxy/health` | Health check |

## Environment Variables

### Required

```env
SAP_AI_CORE_CLIENT_ID=sb-xxxxxx!bxxxxxx|xsuaa_std!bxxxxxx
SAP_AI_CORE_CLIENT_SECRET=your-client-secret
```

### Optional

```env
# SAP AI Core URLs (defaults provided)
SAP_AI_CORE_URL=https://api.ai.intprod-eu12.eu-central-1.aws.ml.hana.ondemand.com
SAP_AI_CORE_AUTH_URL=https://your-zone.authentication.eu12.hana.ondemand.com
SAP_AI_CORE_RESOURCE_GROUP=default

# Default model when none specified
SAP_DEFAULT_MODEL=gpt-4o

# Enable detailed logging
SAP_ENABLE_LOGGING=true

# Optional API key for proxy authentication
PROXY_API_KEY=your-api-key

# Custom model mappings (JSON format)
SAP_MODEL_MAPPINGS={"gpt-4":"deployment-id-1","claude-3-opus":"deployment-id-2"}

# Individual deployment ID mappings
SAP_DEPLOYMENT_GPT4=your-gpt4-deployment-id
SAP_DEPLOYMENT_GPT4O=your-gpt4o-deployment-id
SAP_DEPLOYMENT_CLAUDE35_SONNET=your-claude-deployment-id
```

## Usage Examples

### OpenAI Python SDK

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://your-project.supabase.co/functions/v1/ai-proxy/v1",
    api_key="your-optional-proxy-api-key"  # or any string if PROXY_API_KEY not set
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.choices[0].message.content)
```

### OpenAI Python SDK (Streaming)

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://your-project.supabase.co/functions/v1/ai-proxy/v1",
    api_key="optional-key"
)

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

### OpenAI Node.js SDK

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://your-project.supabase.co/functions/v1/ai-proxy/v1',
  apiKey: 'optional-key',
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);
```

### cURL

```bash
# List models
curl https://your-project.supabase.co/functions/v1/ai-proxy/v1/models

# Chat completion
curl https://your-project.supabase.co/functions/v1/ai-proxy/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-optional-api-key" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'

# Streaming chat completion
curl https://your-project.supabase.co/functions/v1/ai-proxy/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'
```

### Claude Code / Anthropic SDK

```python
import anthropic

client = anthropic.Anthropic(
    base_url="https://your-project.supabase.co/functions/v1/ai-proxy/v1",
    api_key="optional-key"
)

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude!"}
    ]
)

print(message.content[0].text)
```

## Supported Models

The proxy maps model names to SAP AI Core deployment IDs. Below are the available models:

### OpenAI Models
| Model Name | SAP AI Core ID |
|------------|----------------|
| `gpt-4.1` | `gpt-4.1` |
| `gpt-4` | `gpt-4.1` |
| `gpt-4-turbo` | `gpt-4.1` |
| `gpt-4o` | `gpt-4.1` |
| `gpt-4o-mini` | `gpt-4.1` |
| `gpt-3.5-turbo` | `gpt-4.1` |

### Anthropic Claude Models

| Model Name | SAP AI Core ID | Display Name |
|------------|----------------|--------------|
| `claude-3-haiku` | `anthropic--claude-3-haiku` | Claude 3 Haiku |
| `claude-4-sonnet` | `anthropic--claude-4-sonnet` | Claude 4 Sonnet |
| `claude-4.5-haiku` | `anthropic--claude-4.5-haiku` | Claude 4.5 Haiku |
| `claude-4.5-opus` | `anthropic--claude-4.5-opus` | Claude 4.5 Opus |
| `claude-4.5-sonnet` | `anthropic--claude-4.5-sonnet` | Claude 4.5 Sonnet |
| `claude-4.6-opus` | `anthropic--claude-4.6-opus` | Claude 4.6 Opus |
| `claude-4.6-sonnet` | `anthropic--claude-4.6-sonnet` | Claude 4.6 Sonnet |

### Cohere Models
| Model Name | SAP AI Core ID |
|------------|----------------|
| `cohere-command-a-reasoning` | `cohere--command-a-reasoning` |
| `cohere-reranker` | `cohere-reranker` |

### Google Gemini Models
| Model Name | SAP AI Core ID |
|------------|----------------|
| `gemini-1.5-pro` | `gemini-1.5-pro` |
| `gemini-1.5-flash` | `gemini-1.5-flash` |

## Custom Model Mappings

You can map model names to specific SAP AI Core deployment IDs:

### Via Environment Variable

```env
SAP_MODEL_MAPPINGS={"my-model":"d1234567890","another-model":"d0987654321"}
```

### Via Individual Variables

```env
SAP_DEPLOYMENT_GPT4=d1234567890
SAP_DEPLOYMENT_GPT4O=d0987654321
SAP_DEPLOYMENT_CLAUDE35_SONNET=d1122334455
```

## Deployment

### Local Development

```bash
# Start Supabase locally
supabase start

# Serve functions locally
supabase functions serve ai-proxy --env-file ./supabase/.env.local
```

### Deploy to Supabase

```bash
# Set secrets
supabase secrets set SAP_AI_CORE_CLIENT_ID=your-client-id
supabase secrets set SAP_AI_CORE_CLIENT_SECRET=your-client-secret
supabase secrets set SAP_AI_CORE_AUTH_URL=https://your-zone.authentication.eu12.hana.ondemand.com

# Deploy
supabase functions deploy ai-proxy
```

## SAP AI Core Configuration

This proxy expects SAP AI Core to be configured with the following:

1. **AI Core instance** with access to foundation models
2. **Service binding** with OAuth credentials
3. **Deployments** for each model you want to use

### Service Binding Format

```json
{
  "serviceurls": {
    "AI_API_URL": "https://api.ai.intprod-eu12.eu-central-1.aws.ml.hana.ondemand.com"
  },
  "appname": "your-app-name",
  "clientid": "sb-xxx!bxxx|xsuaa_std!bxxx",
  "clientsecret": "your-client-secret",
  "identityzone": "your-zone",
  "identityzoneid": "your-zone-id",
  "url": "https://your-zone.authentication.eu12.hana.ondemand.com",
  "credential-type": "binding-secret"
}
```

## Error Handling

The proxy returns errors in OpenAI-compatible format:

```json
{
  "error": {
    "message": "Error description",
    "type": "invalid_request_error",
    "param": "messages",
    "code": "invalid_messages"
  }
}
```

## Troubleshooting

### Token Errors

If you see authentication errors:
1. Verify `SAP_AI_CORE_CLIENT_ID` and `SAP_AI_CORE_CLIENT_SECRET` are correct
2. Check that `SAP_AI_CORE_AUTH_URL` points to your identity zone
3. Ensure your service binding has not expired

### Model Not Found

If a model returns 404:
1. Verify the deployment exists in SAP AI Core
2. Check the deployment ID mapping in environment variables
3. Try using the deployment ID directly as the model name

### Streaming Issues

If streaming doesn't work:
1. Ensure your client supports SSE
2. Check that no proxy/load balancer is buffering responses
3. Try the non-streaming endpoint first to verify connectivity

## Architecture

```
┌─────────────┐      ┌───────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │──────│  AI Proxy     │──────│  SAP XSUAA   │──────│ SAP AI Core │
│ (OpenAI SDK)│      │ (Edge Func)   │      │  (Auth)      │      │  (Models)   │
└─────────────┘      └───────────────┘      └──────────────┘      └─────────────┘
                            │
                            ├── Transform Request (OpenAI → SAP)
                            ├── Handle OAuth2 Token
                            ├── Stream/Non-stream Response
                            └── Transform Response (SAP → OpenAI)
```

## License

This project is provided as-is for use with SAP AI Core.