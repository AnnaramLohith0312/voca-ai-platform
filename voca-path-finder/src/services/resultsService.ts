// src/services/resultsService.ts
import type { IResultsService, ResultsPayload } from "./interfaces";
import { detectStage } from "../engine/stageDetection";
import { extractSignals } from "../engine/signalExtractor";
import { generateRecommendations } from "../engine/recommendationEngine";

const RESULTS_KEY = "voca_results";

export const resultsService: IResultsService = {
  async generateResults(userId: string, answers: Record<string, string> = {}, pinnedCareerTitle?: string): Promise<ResultsPayload> {
    const cachedSignals = localStorage.getItem(`voca_signals_${userId}`);
    let signals;
    if (cachedSignals) {
      try {
        signals = JSON.parse(cachedSignals);
      } catch {
        // Fallback
      }
    }

    if (!signals) {
      const stageQuestion = "Where are you right now in your journey?";
      const firstAns = answers[stageQuestion] || "I’m doing my UG";
      const stageResult = detectStage(firstAns);
      const stage = stageResult.stage === "unknown" ? "undergraduate" : stageResult.stage;
      signals = extractSignals(stage, answers);
    }

    const payload = generateRecommendations(userId, signals, answers, pinnedCareerTitle);
    
    localStorage.setItem(`${RESULTS_KEY}_${userId}`, JSON.stringify(payload));
    return payload;
  },

  async getResults(userId: string): Promise<ResultsPayload | null> {
    try {
      const raw = localStorage.getItem(`${RESULTS_KEY}_${userId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async clearResults(userId: string): Promise<void> {
    localStorage.removeItem(`${RESULTS_KEY}_${userId}`);
  },
};

