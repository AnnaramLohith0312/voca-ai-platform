// src/services/onboardingService.ts
import type { IOnboardingService, OnboardingAnswer, OnboardingSession } from "./interfaces";

export type { OnboardingAnswer, OnboardingSession };

const SESSION_KEY = "voca_onboarding_session";

export const onboardingService: IOnboardingService = {
  async saveSession(userId: string, answers: OnboardingAnswer[]): Promise<void> {
    const session: OnboardingSession = {
      userId,
      answers,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(`${SESSION_KEY}_${userId}`, JSON.stringify(session));
  },

  async getSession(userId: string): Promise<OnboardingSession | null> {
    try {
      const raw = localStorage.getItem(`${SESSION_KEY}_${userId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async clearSession(userId: string): Promise<void> {
    localStorage.removeItem(`${SESSION_KEY}_${userId}`);
  },
};
