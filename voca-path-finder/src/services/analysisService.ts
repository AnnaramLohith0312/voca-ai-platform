// src/services/analysisService.ts
import type { IAnalysisService, AnalysisJob, AnalysisStatus, AnalysisPhase, OnboardingAnswer } from "./interfaces";
import { resultsService } from "./resultsService";

export type { AnalysisJob, AnalysisStatus, AnalysisPhase };

export const ANALYSIS_PHASES: AnalysisPhase[] = [
  { title: "Reading your signals", subtitle: "Reviewing the answers you shared with us...", progress: 20 },
  { title: "Mapping strengths and preferences", subtitle: "Identifying where your skills and goals align...", progress: 42 },
  { title: "Comparing career paths", subtitle: "Matching your profile across thousands of role patterns...", progress: 65 },
  { title: "Building your recommendation set", subtitle: "Selecting the paths most relevant to your direction...", progress: 88 },
];

const JOB_KEY = "voca_analysis_job";

export const analysisService: IAnalysisService = {
  async startAnalysis(userId: string, answers: OnboardingAnswer[]): Promise<AnalysisJob> {
    const job: AnalysisJob = {
      analysisId: `analysis_${userId}_${Date.now()}`,
      userId,
      status: "processing",
      startedAt: new Date().toISOString(),
      answers,
    };
    localStorage.setItem(`${JOB_KEY}_${userId}`, JSON.stringify(job));
    return job;
  },

  async getJob(userId: string): Promise<AnalysisJob | null> {
    try {
      const raw = localStorage.getItem(`${JOB_KEY}_${userId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async getStatus(userId: string): Promise<AnalysisStatus> {
    try {
      const raw = localStorage.getItem(`${JOB_KEY}_${userId}`);
      if (!raw) return "idle";
      const job: AnalysisJob = JSON.parse(raw);
      return job.status;
    } catch {
      return "error";
    }
  },

  async getJobProgress(userId: string): Promise<{
    status: AnalysisStatus;
    progress: number;
    currentPhase: AnalysisPhase | null;
  }> {
    try {
      const raw = localStorage.getItem(`${JOB_KEY}_${userId}`);
      if (!raw) {
        return { status: "idle", progress: 0, currentPhase: null };
      }

      const job: AnalysisJob = JSON.parse(raw);
      if (job.status === "complete") {
        return { status: "complete", progress: 100, currentPhase: null };
      }
      if (job.status === "error") {
        return { status: "error", progress: 0, currentPhase: null };
      }

      const elapsed = Date.now() - new Date(job.startedAt).getTime();
      const duration = 8000; // 8 seconds total duration

      if (elapsed >= duration) {
        // Complete the job
        job.status = "complete";
        job.completedAt = new Date().toISOString();
        localStorage.setItem(`${JOB_KEY}_${userId}`, JSON.stringify(job));

        // Auto-generate the results using the results service
        const answersMap = (job.answers || []).reduce<Record<string, string>>(
          (acc, a) => ({ ...acc, [a.question]: a.answer }),
          {}
        );
        await resultsService.generateResults(userId, answersMap);

        return { status: "complete", progress: 100, currentPhase: null };
      }

      // Determine the current phase (2000ms per phase)
      const phaseIndex = Math.min(Math.floor(elapsed / 2000), ANALYSIS_PHASES.length - 1);
      const phase = ANALYSIS_PHASES[phaseIndex];

      // Interpolate progress smoothly
      const startProgress = phaseIndex === 0 ? 0 : ANALYSIS_PHASES[phaseIndex - 1].progress;
      const endProgress = phase.progress;
      const phaseElapsed = elapsed % 2000;
      const progress = Math.min(
        Math.round(startProgress + ((endProgress - startProgress) * phaseElapsed) / 2000),
        99
      );

      return {
        status: "processing",
        progress,
        currentPhase: phase,
      };
    } catch {
      return { status: "error", progress: 0, currentPhase: null };
    }
  },

  async clearJob(userId: string): Promise<void> {
    localStorage.removeItem(`${JOB_KEY}_${userId}`);
  },
};
