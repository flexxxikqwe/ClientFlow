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
      contents: `You are a senior sales assistant. Analyze this lead data and provide a grounded executive summary.
      Refer to the lead by name and reference their specific company and inquiry details.
      
      Lead Context: ${text}
      
      Instructions:
      - Start the summary by mentioning the lead's name and company.
      - Highlight specific pain points mentioned in their message or notes.
      - Keep it professional and high-signal.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A concise, grounded summary referencing the lead's name and specific context." },
            keyPoints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3-4 specific takeaways based on the inquiry and activity."
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
      contents: `Evaluate this lead's priority (hot, warm, cold). 
      Your reasoning MUST explicitly cite data points from the lead's message, company size/profile, or recent activity.
      
      Lead Data: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { 
              type: Type.STRING, 
              enum: ["hot", "warm", "cold"],
              description: "Priority based on intent and fit."
            },
            reasoning: { type: Type.STRING, description: "Specific explanation citing data points from the provided context." }
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
      contents: `Draft a personalized professional follow-up for this lead. 
      - Address them by name.
      - Mention their company.
      - Directly reference a specific question or detail from their inquiry message.
      - Goal: High-trust, low-friction professional engagement.
      
      Lead Context: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING, description: "Personalized subject line." },
            body: { type: Type.STRING, description: "Personalized email body referencing lead specifics." }
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
