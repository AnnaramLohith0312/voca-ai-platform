// src/models/analysis.ts
import { DbOnboardingAnswer } from "./onboarding";

export type AnalysisStatus = "idle" | "pending" | "processing" | "complete" | "error";

export interface DbAnalysisPhase {
  title: string;
  subtitle: string;
  progress: number;
}

export interface DbAnalysisJob {
  jobId: string;
  userId: string;
  status: AnalysisStatus;
  progress: number;
  currentPhase: DbAnalysisPhase | null;
  startedAt: string;
  completedAt?: string;
  answers: DbOnboardingAnswer[];
}
