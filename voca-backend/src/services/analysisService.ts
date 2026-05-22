// src/services/analysisService.ts
import { adminDb, isAdminConfigured } from "@/lib/firebaseAdmin";
import { DbAnalysisJob, DbAnalysisPhase, AnalysisStatus } from "@/models/analysis";
import { DbOnboardingAnswer } from "@/models/onboarding";
import { resultsService } from "./resultsService";

const mockJobStore = new Map<string, DbAnalysisJob>();

const PHASES: DbAnalysisPhase[] = [
  { title: "Analyzing Profile", subtitle: "Extracting career focus signals...", progress: 25 },
  { title: "Mapping Competencies", subtitle: "Aligning skills with trajectory demand...", progress: 55 },
  { title: "Simulating Trajectories", subtitle: "Generating alternative path alignments...", progress: 85 },
  { title: "Finalizing Career Map", subtitle: "Assembling Strategic Rationale...", progress: 100 },
];

const TOTAL_DURATION = 9000; // 9 seconds total simulation

function calculateJobProgress(startedAtMs: number): {
  status: AnalysisStatus;
  progress: number;
  currentPhase: DbAnalysisPhase | null;
} {
  const elapsed = Date.now() - startedAtMs;

  if (elapsed >= TOTAL_DURATION) {
    return {
      status: "complete",
      progress: 100,
      currentPhase: PHASES[3],
    };
  }

  // Segment intervals: 
  // 0 - 2000ms (25% progress)
  // 2000 - 5000ms (55% progress)
  // 5000 - 7500ms (85% progress)
  // 7500 - 9000ms (100% progress)
  if (elapsed < 2000) {
    const ratio = elapsed / 2000;
    const progress = Math.round(ratio * 25);
    return { status: "processing", progress, currentPhase: PHASES[0] };
  } else if (elapsed < 5000) {
    const ratio = (elapsed - 2000) / 3000;
    const progress = Math.round(25 + ratio * 30);
    return { status: "processing", progress, currentPhase: PHASES[1] };
  } else if (elapsed < 7500) {
    const ratio = (elapsed - 5000) / 2500;
    const progress = Math.round(55 + ratio * 30);
    return { status: "processing", progress, currentPhase: PHASES[2] };
  } else {
    const ratio = (elapsed - 7500) / 1500;
    const progress = Math.round(85 + ratio * 15);
    return { status: "processing", progress, currentPhase: PHASES[3] };
  }
}

export const analysisService = {
  /**
   * Starts a new analysis job for a user.
   */
  async startAnalysis(userId: string, answers: DbOnboardingAnswer[]): Promise<DbAnalysisJob> {
    const jobId = `job_${userId}_${Date.now()}`;
    const startedAt = new Date().toISOString();

    const jobData: DbAnalysisJob = {
      jobId,
      userId,
      status: "processing",
      progress: 0,
      currentPhase: PHASES[0],
      startedAt,
      answers,
    };

    if (isAdminConfigured && adminDb) {
      try {
        await adminDb.collection("analysisJobs").doc(userId).set(jobData);
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to start analysis job.");
      }
    } else {
      mockJobStore.set(userId, jobData);
    }

    return jobData;
  },

  /**
   * Retrieves status progress. Automatically handles final transitions and results generation.
   */
  async getJobProgress(userId: string): Promise<{
    status: AnalysisStatus;
    progress: number;
    currentPhase: DbAnalysisPhase | null;
  }> {
    let job: DbAnalysisJob | null = null;

    if (isAdminConfigured && adminDb) {
      try {
        const docSnap = await adminDb.collection("analysisJobs").doc(userId).get();
        if (docSnap.exists) {
          job = docSnap.data() as DbAnalysisJob;
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to check analysis progress.");
      }
    } else {
      job = mockJobStore.get(userId) || null;
    }

    if (!job) {
      return { status: "idle", progress: 0, currentPhase: null };
    }

    if (job.status === "complete") {
      return { status: "complete", progress: 100, currentPhase: PHASES[3] };
    }

    const startedAtMs = new Date(job.startedAt).getTime();
    const current = calculateJobProgress(startedAtMs);

    // If progression indicates completion, finalize the job and pre-generate the results.
    if (current.status === "complete") {
      // 1. Generate results
      const answersMap: Record<string, string> = {};
      job.answers.forEach((ans) => {
        answersMap[ans.question] = ans.answer;
      });
      await resultsService.generateResults(userId, answersMap);

      // 2. Save complete state in db
      const completedJob: DbAnalysisJob = {
        ...job,
        status: "complete",
        progress: 100,
        currentPhase: PHASES[3],
        completedAt: new Date().toISOString(),
      };

      if (isAdminConfigured && adminDb) {
        await adminDb.collection("analysisJobs").doc(userId).set(completedJob, { merge: true });
      } else {
        mockJobStore.set(userId, completedJob);
      }

      return { status: "complete", progress: 100, currentPhase: PHASES[3] };
    }

    return current;
  },

  /**
   * Fetches the complete raw job record.
   */
  async getJob(userId: string): Promise<DbAnalysisJob | null> {
    if (isAdminConfigured && adminDb) {
      const docSnap = await adminDb.collection("analysisJobs").doc(userId).get();
      if (!docSnap.exists) return null;
      return docSnap.data() as DbAnalysisJob;
    } else {
      return mockJobStore.get(userId) || null;
    }
  },

  /**
   * Resets or deletes any active job logs.
   */
  async clearJob(userId: string): Promise<void> {
    if (isAdminConfigured && adminDb) {
      await adminDb.collection("analysisJobs").doc(userId).delete();
    } else {
      mockJobStore.delete(userId);
    }
  }
};
