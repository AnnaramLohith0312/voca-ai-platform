// src/services/onboardingService.ts
import { adminDb, isAdminConfigured } from "@/lib/firebaseAdmin";
import { DbOnboardingSession, DbOnboardingAnswer } from "@/models/onboarding";

// Local in-memory store for fallback environments
const mockOnboardingStore = new Map<string, DbOnboardingSession>();

export const onboardingService = {
  /**
   * Saves an in-progress onboarding session draft.
   */
  async saveDraft(userId: string, answers: DbOnboardingAnswer[], currentStep: number): Promise<DbOnboardingSession> {
    const existing = await this.getSession(userId);
    const now = new Date().toISOString();

    const data: DbOnboardingSession = {
      userId,
      answers,
      status: "in-progress",
      currentStep,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      version: "1.0",
    };

    if (isAdminConfigured && adminDb) {
      try {
        const docRef = adminDb.collection("onboarding").doc(userId);
        await docRef.set(data, { merge: true });
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to save onboarding draft.");
      }
    } else {
      mockOnboardingStore.set(userId, {
        ...data,
        version: "1.0-mock",
      });
    }

    return data;
  },

  /**
   * Finalizes and submits the onboarding session.
   */
  async submitSession(userId: string, answers: DbOnboardingAnswer[]): Promise<DbOnboardingSession> {
    const existing = await this.getSession(userId);
    const now = new Date().toISOString();

    const data: DbOnboardingSession = {
      userId,
      answers,
      status: "completed",
      currentStep: answers.length,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      completedAt: now,
      version: "1.0",
    };

    if (isAdminConfigured && adminDb) {
      try {
        const docRef = adminDb.collection("onboarding").doc(userId);
        await docRef.set(data, { merge: true });
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to submit onboarding session.");
      }
    } else {
      mockOnboardingStore.set(userId, {
        ...data,
        version: "1.0-mock",
      });
    }

    return data;
  },

  /**
   * Backwards compatible save session, calls submitSession.
   */
  async saveSession(userId: string, answers: DbOnboardingAnswer[]): Promise<void> {
    await this.submitSession(userId, answers);
  },

  /**
   * Retrieves onboarding session answers for a user.
   */
  async getSession(userId: string): Promise<DbOnboardingSession | null> {
    if (isAdminConfigured && adminDb) {
      try {
        const docSnap = await adminDb.collection("onboarding").doc(userId).get();
        if (!docSnap.exists) return null;
        return docSnap.data() as DbOnboardingSession;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to fetch onboarding session.");
      }
    } else {
      return mockOnboardingStore.get(userId) || null;
    }
  },

  /**
   * Deletes the onboarding session answers for a user.
   */
  async clearSession(userId: string): Promise<void> {
    if (isAdminConfigured && adminDb) {
      try {
        await adminDb.collection("onboarding").doc(userId).delete();
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to clear onboarding session.");
      }
    } else {
      mockOnboardingStore.delete(userId);
    }
  }
};
