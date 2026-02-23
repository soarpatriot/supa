import { AnalysisResult } from "./types.ts";
import { ENABLE_LOGGING } from "./config.ts";
import { getDeploymentId } from "../_shared/sap/config.ts";
import { sapFetch } from "../_shared/sap/auth.ts";

const BOOK_ANALYSIS_MODEL = "claude-4.6-opus";

export const analyzeBookWithGemini = async (title: string, author: string): Promise<AnalysisResult> => {
  const prompt = `Please analyze the book "${title}" by ${author}.
  Provide the output in Simplified Chinese (简体中文).
  I need three things:
  1. A one-sentence essence summary.
  2. Three bullet points of "Wisdom to Learn" (key takeaways).
  3. A short, inspiring quote from the book (or a paraphrased wisdom if exact quote unavailable).
  
  Return your response as valid JSON with this structure:
  {
    "summary": "A concise summary of the book's core value",
    "keyPoints": ["Point 1", "Point 2", "Point 3"],
    "quote": "An inspiring quote or golden sentence from the book"
  }`;

  try {
    const deploymentId = getDeploymentId(BOOK_ANALYSIS_MODEL);
    
    if (ENABLE_LOGGING) {
      console.log(`[Book Analysis] Using model: ${BOOK_ANALYSIS_MODEL}, deployment: ${deploymentId}`);
    }

    // Use SAP AI Core invoke endpoint for Anthropic models
    const endpoint = `/v2/inference/deployments/${deploymentId}/invoke`;
    
    const response = await sapFetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2048,
        messages: [{
          role: "user",
          content: prompt
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Book Analysis] SAP AI Core error: ${response.status} ${response.statusText}`);
      console.error(`[Book Analysis] Error response: ${errorText}`);
      throw new Error(`SAP AI Core error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (ENABLE_LOGGING) {
      console.log("[Book Analysis] Response:", JSON.stringify(result, null, 2));
    }

    // Extract text from Anthropic response format
    const text = result?.content?.[0]?.text || "";
    
    if (!text) {
      throw new Error("No response from AI");
    }
    
    // Parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from response");
    }
    
    return JSON.parse(jsonMatch[0]) as AnalysisResult;
  } catch (error) {
    console.error("Book Analysis Failed", error);
    // Fallback in case of error (graceful degradation)
    return {
      summary: "暂时无法获取AI解读，请稍后再试。",
      keyPoints: ["深入阅读以获取更多智慧", "保持好奇心", "书山有路勤为径"],
      quote: "学而知之。"
    };
  }
};