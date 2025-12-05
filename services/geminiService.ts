import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRepairIssue = async (
  device: string,
  brand: string,
  model: string,
  issue: string
): Promise<string> => {
  try {
    const prompt = `
      Device: ${device}
      Brand: ${brand}
      Model: ${model}
      Issue: ${issue}

      Please analyze this repair issue. Provide a brief diagnosis of what might be wrong and a very rough estimated price range (in USD) for the repair parts and labor. Keep it under 50 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert electronics repair technician at Rasel Repair Center. You provide helpful, concise initial diagnoses to customers.",
      }
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI analysis unavailable at the moment.";
  }
};
