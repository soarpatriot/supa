import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "./types.ts";

const testKey = process.env.GOOGLE_API_KEY
console.log("test key: " + testKey)

const apiKey = Deno.env.get("GOOGLE_API_KEY"); 
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY environment variable not set");
}
const ai = new GoogleGenAI({
  apiKey: apiKey
});

export const analyzeBookWithGemini = async (title: string, author: string): Promise<AnalysisResult> => {
  const prompt = `Please analyze the book "${title}" by ${author}.
  Provide the output in Simplified Chinese (简体中文).
  I need three things:
  1. A one-sentence essence summary.
  2. Three bullet points of "Wisdom to Learn" (key takeaways).
  3. A short, inspiring quote from the book (or a paraphrased wisdom if exact quote unavailable).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A concise summary of the book's core value." },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 key wisdom points learned from the book."
            },
            quote: { type: Type.STRING, description: "An inspiring quote or golden sentence from the book." }
          },
          required: ["summary", "keyPoints", "quote"]
        }
      }
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response from AI");
    }
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    // Fallback in case of error (graceful degradation)
    return {
      summary: "暂时无法获取AI解读，请稍后再试。",
      keyPoints: ["深入阅读以获取更多智慧", "保持好奇心", "书山有路勤为径"],
      quote: "学而知之。"
    };
  }
};
