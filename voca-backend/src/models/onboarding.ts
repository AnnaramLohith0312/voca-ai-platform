// src/models/onboarding.ts

export interface DbOnboardingAnswer {
  question: string;
  answer: string;
}

export type OnboardingStatus = "in-progress" | "completed";

export interface DbOnboardingSession {
  userId: string;
  answers: DbOnboardingAnswer[];
  status: OnboardingStatus;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  version?: string;
}
