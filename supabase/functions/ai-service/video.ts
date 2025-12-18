import { GoogleGenAI } from "npm:@google/genai";
import { GOOGLE_API_KEY, supabase } from "./config.ts";

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

export interface VideoGenerationResult {
  videoUrl: string;
  storagePath: string;
  prompt: string;
  operation: any;
}

export interface VideoConfig {
  aspectRatio?: string;
  negativePrompt?: string;
}

export async function generateVideoWithGemini(
  prompt: string,
  model: string = "veo-2.0-generate-001",
  config?: VideoConfig
): Promise<VideoGenerationResult> {
  try {
    // Start video generation
    const generateParams: any = {
      model: model,
      prompt: prompt,
    };

    // Add config if provided
    if (config) {
      generateParams.config = config;
    }

    let operation = await ai.models.generateVideos(generateParams);

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
    const storagePath = `videos/${filename}`;
    const downloadPath = `/tmp/${filename}`;

    // Download the generated video to tmp file
    await ai.files.download({
      file: operation.response.generatedVideos[0].video,
      downloadPath: downloadPath,
    });

    console.log(`Downloaded video to ${downloadPath}`);

    // Read the file and upload to Supabase storage
    const fileData = await Deno.readFile(downloadPath);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('my-videos')
      .upload(storagePath, fileData, {
        contentType: 'video/mp4',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload video to storage: ${error.message}`);
    }

    console.log(`Video uploaded to Supabase storage: ${storagePath}`);

    // Get public URL for the uploaded video
    const { data: urlData } = supabase.storage
      .from('my-videos')
      .getPublicUrl(storagePath);

    // Clean up temporary file
    try {
      await Deno.remove(downloadPath);
      console.log(`Temporary file cleaned up: ${downloadPath}`);
    } catch (cleanupError) {
      console.warn("Failed to cleanup temp file:", cleanupError);
    }

    return {
      videoUrl: urlData.publicUrl,
      storagePath: storagePath,
      prompt: prompt,
      operation: {
        name: operation.name,
        done: operation.done,
        metadata: operation.metadata
      }
    };
  } catch (error) {
    console.error("Error generating video:", error);
    throw new Error(`Failed to generate video: ${error.message}`);
  }
}

export async function generateAndStreamVideo(
  prompt: string,
  model: string = "veo-2.0-generate-001",
  config?: VideoConfig
): Promise<{ filePath: string; cleanup: () => Promise<void> }> {
  try {
    // Start video generation
    const generateParams: any = {
      model: model,
      prompt: prompt,
    };

    // Add config if provided
    if (config) {
      generateParams.config = config;
    }

    let operation = await ai.models.generateVideos(generateParams);

    // Poll the operation status until the video is ready
    while (!operation.done) {
      console.log("Waiting for video generation to complete...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({
        operation: operation,
      });
    }

    // Generate a unique filename for temp storage
    const timestamp = Date.now();
    const filename = `generated_video_${timestamp}.mp4`;
    const downloadPath = `/tmp/${filename}`;

    // Download the generated video to tmp file
    await ai.files.download({
      file: operation.response.generatedVideos[0].video,
      downloadPath: downloadPath,
    });

    console.log(`Downloaded video to ${downloadPath}`);

    // Return the file path and a cleanup function
    const cleanup = async () => {
      try {
        await Deno.remove(downloadPath);
        console.log(`Temporary file cleaned up: ${downloadPath}`);
      } catch (cleanupError) {
        console.warn("Failed to cleanup temp file:", cleanupError);
      }
    };

    return { filePath: downloadPath, cleanup };
  } catch (error) {
    console.error("Error generating video:", error);
    throw new Error(`Failed to generate video: ${error.message}`);
  }
}
