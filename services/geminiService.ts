import { GoogleGenAI } from "@google/genai";
import { blobToBase64 } from "../utils/audioUtils";

// Initialize GenAI Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Image Editing (Gemini 2.5 Flash Image) ---
export const editImage = async (
  imageFile: File,
  prompt: string
): Promise<string> => {
  const base64Data = await blobToBase64(imageFile);
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: imageFile.type,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  // Extract image from response
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  throw new Error("No image generated");
};

// --- Search Grounding (Gemini 2.5 Flash) ---
export const searchGroundingQuery = async (query: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text;
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  const sources = chunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      uri: chunk.web.uri,
      title: chunk.web.title,
    }));

  return { text, sources };
};

// --- Veo Video Generation ---
export const generateVeoVideo = async (
  imageFile: File,
  prompt: string,
  aspectRatio: '16:9' | '9:16'
): Promise<string> => {
  
  // Re-init with fresh key potentially from user selection if needed
  const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = await blobToBase64(imageFile);

  let operation = await freshAi.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || "Animate this image", 
    image: {
      imageBytes: base64Data,
      mimeType: imageFile.type,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio,
    }
  });

  // Polling loop
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
    operation = await freshAi.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Video generation failed");
  
  // Fetch the actual video bytes
  const videoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};

// Export the shared client for Live API usage in components
export { ai };
