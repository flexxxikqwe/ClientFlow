import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("NEXT_PUBLIC_GEMINI_API_KEY is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function generateSummary(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following lead information concisely: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A concise summary of the lead." },
            keyPoints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Key takeaways from the lead info."
            }
          },
          required: ["summary", "keyPoints"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate summary");
  }
}

export async function classifyLead(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Classify the following lead based on their intent and potential: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { 
              type: Type.STRING, 
              enum: ["hot", "warm", "cold"],
              description: "The priority level of the lead."
            },
            reasoning: { type: Type.STRING, description: "Brief explanation for the classification." }
          },
          required: ["priority", "reasoning"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error classifying lead:", error);
    throw new Error("Failed to classify lead");
  }
}

export async function generateReply(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional and engaging follow-up reply for this lead: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING, description: "Suggested email subject line." },
            body: { type: Type.STRING, description: "The body of the reply message." }
          },
          required: ["subject", "body"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating reply:", error);
    throw new Error("Failed to generate reply");
  }
}
