import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION =
  "You are a professional tutor on SkillBridge. Guide students step-by-step with Markdown formatting.";

let _client: GoogleGenerativeAI | null = null;

const getClient = (): GoogleGenerativeAI => {
  if (!_client) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY is not set in environment variables.");
    _client = new GoogleGenerativeAI(key);
  }
  return _client;
};

const askAI = async (prompt: string): Promise<string> => {
  const model = getClient().getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const AIService = { askAI };
