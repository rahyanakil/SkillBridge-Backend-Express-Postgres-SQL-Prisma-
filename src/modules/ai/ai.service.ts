import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION =
  "You are a professional tutor on SkillBridge. Guide students step-by-step with Markdown formatting.";

let _client: GoogleGenerativeAI | null = null;

const getClient = (): GoogleGenerativeAI => {
  if (_client) return _client;
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set in environment variables.");
  _client = new GoogleGenerativeAI(key);
  return _client;
};

const isRateLimitError = (err: any): boolean =>
  typeof err?.message === "string" &&
  (err.message.includes("429") || err.message.toLowerCase().includes("quota"));

const askAI = async (prompt: string): Promise<string> => {
  try {
    const model = getClient().getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      systemInstruction: SYSTEM_INSTRUCTION,
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err: any) {
    if (isRateLimitError(err)) {
      throw new Error(
        "AI_RATE_LIMIT: The AI is currently at capacity. Please wait a moment before trying again.",
      );
    }
    throw err;
  }
};

export const AIService = { askAI };
