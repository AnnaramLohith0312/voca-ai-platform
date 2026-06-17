/**
 * VOCA AI Agent — Gemini 1.5 Flash powered career counselor
 * ─────────────────────────────────────────────────────────────────
 * Manages a stateful chat session with the user.
 * Parses structured output tags from the model:
 *   <VOCA_PROGRESS>N</VOCA_PROGRESS>  → progress 0-100
 *   <VOCA_SIGNALS>{...}</VOCA_SIGNALS> → final CareerSignals JSON
 */

import { GoogleGenerativeAI, type Content } from "@google/generative-ai";
import type { CareerSignals } from "./types";
import type { UserStage } from "../services/interfaces";

// ─── Config ──────────────────────────────────────────────────────────────────

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

const SYSTEM_PROMPT = `You are VOCA — an intelligent, empathetic career guidance assistant built to help people in India find their ideal career path.

Your job is to have a warm, natural conversation with the user to understand:
1. Their current life stage (Class 10 student / Plus 1 or Plus 2 / Undergraduate / Working professional looking to switch)
2. Their interests, hobbies, and what they enjoy doing
3. Their academic strengths and weaknesses
4. Their preferred work style (creative, analytical, people-facing, technical, outdoor, etc.)
5. Their constraints (location, finances, time, family expectations)
6. Their motivators (money, impact, creativity, stability, prestige)
7. Their career aspirations or confusion

CONVERSATION RULES:
- Ask ONE question at a time. Never overwhelm with multiple questions.
- Keep your messages short, friendly, and encouraging. Max 2-3 sentences per reply.
- Use casual, modern English — not formal or robotic.
- Adapt based on their answers. If they mention "army" or "defence", dig into that specifically.
- Ask 6-9 questions total, then wrap up.
- If their answer is vague, ask a quick follow-up before moving on.
- Acknowledge their answer before asking the next question (e.g. "That's interesting!" or "Got it.")

PROGRESS TRACKING:
After every single reply, you MUST include a progress tag on a new line at the very end:
<VOCA_PROGRESS>N</VOCA_PROGRESS>
Where N is a number from 0 to 100 representing how complete the conversation is.
- Start at 10 after your first message
- Increase by ~12-15 each question
- Reach 100 only when you output VOCA_SIGNALS

SIGNAL EXTRACTION — WHEN TO FINISH:
When you have enough information (after ~6-9 exchanges), wrap up the conversation with a warm closing message, then on a new line output:
<VOCA_SIGNALS>
{
  "stage": "<class10|plus1plus2|undergraduate|jobshift>",
  "interests": ["<interest1>", "<interest2>"],
  "subjectAffinity": ["<subject1>", "<subject2>"],
  "strengths": ["<strength1>", "<strength2>"],
  "workStyle": ["<style1>", "<style2>"],
  "learningStyle": ["<style1>"],
  "motivationDrivers": ["<driver1>", "<driver2>"],
  "careerGoals": ["<goal1>", "<goal2>"],
  "constraints": ["<constraint1>"],
  "technicalOrientation": "<High|Medium|Low>",
  "analyticalOrientation": "<High|Medium|Low>",
  "creativityVsStructure": "<Creativity|Structure|Balanced>",
  "communicationOrientation": "<High|Medium|Low>",
  "leadershipInclination": "<High|Medium|Low>",
  "collaborationPreference": "<High|Medium|Low>",
  "confidenceScore": 85,
  "currentStream": "<stream if school student, else null>",
  "degreeProgram": "<degree if UG, else null>",
  "currentRole": "<role if working, else null>",
  "yearsOfExperience": "<years if working, else null>",
  "switchType": "<switch type if jobshift, else null>",
  "rawAnswers": {
    "What is your current stage?": "<their answer>",
    "What are your main interests?": "<their answer>",
    "What subjects do you enjoy?": "<their answer>",
    "What kind of work do you prefer?": "<their answer>",
    "What motivates you most?": "<their answer>",
    "What are your constraints?": "<their answer>"
  }
}
</VOCA_SIGNALS>
<VOCA_PROGRESS>100</VOCA_PROGRESS>

IMPORTANT: The VOCA_SIGNALS block must be valid JSON. Only output it ONCE at the very end of the conversation.

Start the conversation by greeting the user and asking about their current life stage in a warm, engaging way.`;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AgentMessage {
  role: "user" | "model";
  parts: string;
}

export interface AgentResponse {
  reply: string;          // cleaned reply (tags stripped) to display
  rawReply: string;       // full reply including tags
  progress: number;       // 0-100
  signals: CareerSignals | null;    // non-null when conversation is complete
  answersMap: Record<string, string> | null;
  isDone: boolean;
}

// ─── Mock fallback (no API key) ───────────────────────────────────────────────

const MOCK_CONVERSATION: string[] = [
  `Hi! I'm VOCA, your personal career guide. I'm here to help you find a career path that truly fits you. 

To start — where are you in your journey right now? Are you a school student, in college, or already working?
<VOCA_PROGRESS>10</VOCA_PROGRESS>`,

  `That's great to hear! Tell me — what subjects or topics do you genuinely enjoy? It could be anything — coding, art, biology, sports, history, music...
<VOCA_PROGRESS>25</VOCA_PROGRESS>`,

  `Interesting! And when you imagine yourself working 5 years from now, what kind of environment do you picture? Like, are you in an office, outdoors, a lab, on a stage, in a uniform...?
<VOCA_PROGRESS>40</VOCA_PROGRESS>`,

  `I love that image! Now tell me — what matters most to you in a career? Things like high salary, creative freedom, making a difference, job security, travel, or something else?
<VOCA_PROGRESS>55</VOCA_PROGRESS>`,

  `Got it. One more thing — are there any specific fields or careers you've already thought about, even if you're not sure? No pressure, anything is fine to mention.
<VOCA_PROGRESS>70</VOCA_PROGRESS>`,

  `That's really helpful! Last question — are there any constraints I should know about? Like, does your family have expectations, or do you need to stay in a specific city, or is budget a concern for higher education?
<VOCA_PROGRESS>85</VOCA_PROGRESS>`,

  `Thank you so much for sharing all of this with me! I now have a really clear picture of who you are and what you're looking for. Give me a moment while I build your personalized career map...

<VOCA_SIGNALS>
{
  "stage": "undergraduate",
  "interests": ["technology", "problem solving"],
  "subjectAffinity": ["Computer Science", "Mathematics"],
  "strengths": ["analytical thinking", "coding"],
  "workStyle": ["office", "structured"],
  "learningStyle": ["hands-on projects"],
  "motivationDrivers": ["growth", "impact"],
  "careerGoals": ["software engineering", "technology"],
  "constraints": [],
  "technicalOrientation": "High",
  "analyticalOrientation": "High",
  "creativityVsStructure": "Structure",
  "communicationOrientation": "Medium",
  "leadershipInclination": "Medium",
  "collaborationPreference": "Medium",
  "confidenceScore": 80,
  "currentStream": null,
  "degreeProgram": "Engineering & Tech",
  "currentRole": null,
  "yearsOfExperience": null,
  "switchType": null,
  "rawAnswers": {
    "What is your current stage?": "undergraduate",
    "What are your main interests?": "technology",
    "What subjects do you enjoy?": "Computer Science",
    "What kind of work do you prefer?": "office structured work",
    "What motivates you most?": "growth and impact",
    "What are your constraints?": "none"
  }
}
</VOCA_SIGNALS>
<VOCA_PROGRESS>100</VOCA_PROGRESS>`
];

// ─── Parsers ─────────────────────────────────────────────────────────────────

function parseProgress(text: string): number {
  const match = text.match(/<VOCA_PROGRESS>\s*(\d+)\s*(?:<\/?[A-Z_]+>)?/i);
  return match ? Math.min(100, parseInt(match[1], 10)) : 0;
}

function parseSignals(text: string): { signals: CareerSignals; answersMap: Record<string, string> } | null {
  const match = text.match(/<VOCA_SIGNALS>([\s\S]*?)(?:<\/VOCA_SIGNALS>|<\/[A-Z_]+>|$)/i);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[1].trim());
    const answersMap: Record<string, string> = parsed.rawAnswers ?? {};

    const signals: CareerSignals = {
      stage: (parsed.stage ?? "undergraduate") as UserStage,
      interests: parsed.interests ?? [],
      academicPreferences: [],
      subjectAffinity: parsed.subjectAffinity ?? [],
      strengths: parsed.strengths ?? [],
      workStyle: parsed.workStyle ?? [],
      learningStyle: parsed.learningStyle ?? [],
      motivationDrivers: parsed.motivationDrivers ?? [],
      collaborationPreference: parsed.collaborationPreference ?? "Medium",
      creativityVsStructure: parsed.creativityVsStructure ?? "Balanced",
      analyticalOrientation: parsed.analyticalOrientation ?? "Medium",
      communicationOrientation: parsed.communicationOrientation ?? "Medium",
      technicalOrientation: parsed.technicalOrientation ?? "Medium",
      leadershipInclination: parsed.leadershipInclination ?? "Medium",
      problemPreference: "Balanced",
      careerGoals: parsed.careerGoals ?? [],
      constraints: parsed.constraints ?? [],
      confidenceScore: parsed.confidenceScore ?? 75,
      currentStream: parsed.currentStream ?? undefined,
      degreeProgram: parsed.degreeProgram ?? undefined,
      currentRole: parsed.currentRole ?? undefined,
      yearsOfExperience: parsed.yearsOfExperience ?? undefined,
      switchType: parsed.switchType ?? undefined,
    };

    return { signals, answersMap };
  } catch {
    return null;
  }
}

function stripTags(text: string): string {
  return text
    .replace(/<VOCA_PROGRESS>\s*\d+\s*(?:<\/?[A-Z_]+>)?/gi, "")
    .replace(/<VOCA_SIGNALS>[\s\S]*?(?:<\/VOCA_SIGNALS>|<\/[A-Z_]+>|$)/gi, "")
    .trim();
}

// ─── Mock Agent ───────────────────────────────────────────────────────────────

let mockIndex = 0;

function sendMockMessage(_userInput: string): AgentResponse {
  const raw = MOCK_CONVERSATION[Math.min(mockIndex, MOCK_CONVERSATION.length - 1)];
  mockIndex++;

  const progress = parseProgress(raw);
  const parsed = parseSignals(raw);
  const reply = stripTags(raw);

  return {
    reply,
    rawReply: raw,
    progress,
    signals: parsed?.signals ?? null,
    answersMap: parsed?.answersMap ?? null,
    isDone: !!parsed,
  };
}

// ─── Gemini Agent ─────────────────────────────────────────────────────────────

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI | null {
  if (!API_KEY) return null;
  if (!genAI) genAI = new GoogleGenerativeAI(API_KEY);
  return genAI;
}

export function isAIConfigured(): boolean {
  return !!API_KEY;
}

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const errorString = String(err?.message || err || "").toLowerCase();
    const isRetryable =
      err?.status === 503 ||
      err?.status === 429 ||
      errorString.includes("503") ||
      errorString.includes("429") ||
      errorString.includes("high demand") ||
      errorString.includes("busy") ||
      errorString.includes("resource exhausted") ||
      errorString.includes("quota exceeded");

    if (retries > 0 && isRetryable) {
      console.warn(`Gemini API returned retryable error: "${errorString}". Retrying in ${delay}ms... (attempts left: ${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(fn, retries - 1, delay * 1.5);
    }
    throw err;
  }
}

async function attemptSendMessage(
  ai: GoogleGenerativeAI,
  modelName: string,
  history: AgentMessage[],
  userInput: string
): Promise<AgentResponse> {
  const model = ai.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
  });

  // Build Gemini chat history format
  const geminiHistory: Content[] = history.map((m) => ({
    role: m.role,
    parts: [{ text: m.parts }],
  }));

  const chat = model.startChat({ history: geminiHistory });
  const result = await fetchWithRetry(() => chat.sendMessage(userInput));
  const raw = result.response.text();

  const progress = parseProgress(raw);
  const parsed = parseSignals(raw);
  const reply = stripTags(raw);

  return {
    reply,
    rawReply: raw,
    progress: progress || 10,
    signals: parsed?.signals ?? null,
    answersMap: parsed?.answersMap ?? null,
    isDone: !!parsed,
  };
}

export async function sendMessage(
  history: AgentMessage[],
  userInput: string
): Promise<AgentResponse> {
  const ai = getGenAI();

  // ── Fallback to mock if no API key ───────────────────────────────
  if (!ai) {
    console.warn("VOCA: No VITE_GEMINI_API_KEY found. Using mock conversation.");
    return sendMockMessage(userInput);
  }

  let modelName = "gemini-2.5-flash";
  try {
    return await attemptSendMessage(ai, modelName, history, userInput);
  } catch (err: any) {
    console.warn(
      `VOCA AI Agent: Primary model ${modelName} failed. Falling back to gemini-2.5-flash-lite...`,
      err?.message || err
    );
    try {
      modelName = "gemini-2.5-flash-lite";
      return await attemptSendMessage(ai, modelName, history, userInput);
    } catch (fallbackErr) {
      console.error("VOCA AI Agent error (both models failed):", fallbackErr);
      throw new Error("Failed to communicate with VOCA AI Agent. Please try again.");
    }
  }
}

/** Called once on mount to get the AI's opening greeting */
export async function startConversation(): Promise<AgentResponse> {
  return sendMessage([], "__START__");
}

export async function askCareerFollowUp(
  careerTitle: string,
  stage: string,
  history: AgentMessage[],
  userInput: string
): Promise<string> {
  const ai = getGenAI();

  const prompt = `You are VOCA — an expert career guidance assistant. The user has just completed their onboarding and received recommendations.
Their primary recommended career trajectory is: "${careerTitle}" (at the "${stage}" life stage).

Your task is to answer the user's follow-up questions about this specific career path in India.
- Keep your answers highly encouraging, realistic, clear, and actionable.
- Max 3-4 sentences per response.
- Provide specific local context for India if relevant (e.g. entry exams like GATE/CLAT/CAT, top colleges, or salary bands in INR).
- Do not mention any progress tags or signals. Just write a conversational reply.`;

  if (!ai) {
    console.warn("VOCA: No VITE_GEMINI_API_KEY found. Using mock follow-up reply.");
    return `That's a great question about the ${careerTitle} role! In India, this path offers excellent growth, typically starting around ₹6-8L/year and scaling rapidly as you build expertise. Focused preparation on core skills and targeted internships will set you up for success.`;
  }

  let modelName = "gemini-2.5-flash";
  const getResponse = async (modelNameStr: string) => {
    const model = ai.getGenerativeModel({
      model: modelNameStr,
      systemInstruction: prompt,
    });
    const geminiHistory: Content[] = history.map((m) => ({
      role: m.role,
      parts: [{ text: m.parts }],
    }));
    const chat = model.startChat({ history: geminiHistory });
    const result = await fetchWithRetry(() => chat.sendMessage(userInput));
    return result.response.text().trim();
  };

  try {
    return await getResponse(modelName);
  } catch (err: any) {
    console.warn(`VOCA AI Agent Follow-up: Primary model ${modelName} failed. Trying fallback...`, err?.message || err);
    try {
      return await getResponse("gemini-2.5-flash-lite");
    } catch (fallbackErr) {
      console.error("VOCA AI Agent Follow-up error:", fallbackErr);
      return "I'm sorry, I'm currently unable to process your request. Please try again in a few moments.";
    }
  }
}
