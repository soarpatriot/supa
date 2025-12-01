import { GoogleGenAI } from "npm:@google/genai";
import { GOOGLE_API_KEY } from "./config.ts";

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

export interface VideoGenerationResult {
  videoPath: string;
  filePath: string;
  prompt: string;
}

export async function generateVideoWithGemini(
  prompt: string
): Promise<VideoGenerationResult> {
  try {
    // Start video generation
    let operation = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
      prompt: prompt,
    });

    // Poll the operation status until the video is ready
    while (!operation.done) {
      console.log("Waiting for video generation to complete...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({
        operation: operation,
      });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `generated_video_${timestamp}.mp4`;
    const downloadPath = `/tmp/${filename}`;

    // Download the generated video to tmp file
    await ai.files.download({
      file: operation.response.generatedVideos[0].video,
      downloadPath: downloadPath,
    });

    console.log(`Generated video saved to ${downloadPath}`);

    return {
      videoPath: filename,
      filePath: downloadPath,
      prompt: prompt,
    };
  } catch (error) {
    console.error("Error generating video:", error);
    throw new Error(`Failed to generate video: ${error.message}`);
  }
}
