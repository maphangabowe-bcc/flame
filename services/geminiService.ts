
import { GoogleGenAI, Type } from "@google/genai";

// Standard initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRantCatharsis = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is ranting: "${content}". Give a short, witty, empathetic, or funny response that provides catharsis. Keep it under 50 words. Be slightly edgy but helpful.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI is too stunned by your rant to respond. We feel you though.";
  }
};

export const getGroupInsights = async (rants: string[]) => {
  if (rants.length === 0) return null;
  try {
    const combined = rants.slice(0, 8).join("\n---\n");
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these rants from a community cluster, summarize the 'collective frustration' and provide one 'unhinged but insightful' piece of advice for the group: \n${combined}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Couldn't distill the saltiness today.";
  }
};

export const getGlobalRadiationPulse = async (allRants: string[]) => {
  if (allRants.length === 0) return "Silence in the vacuum.";
  try {
    const sample = allRants.slice(0, 15).join("\n");
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the general mood of these social rants and give a 2-sentence 'Radiation Weather Report' for the network: \n${sample}`,
    });
    return response.text;
  } catch (error) {
    return "Atmospheric interference detected.";
  }
};

export const getRantAnalysisJSON = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this rant for intensity and key themes: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intensity: { type: Type.NUMBER, description: "1 to 10 scale of how angry/passionate it is" },
            primaryEmotion: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["intensity", "primaryEmotion", "summary"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { intensity: 5, primaryEmotion: "Indeterminate", summary: "A mysterious vent." };
  }
};
