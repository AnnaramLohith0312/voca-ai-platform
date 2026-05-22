import { describe, it, expect, beforeEach, vi } from "vitest";
import { authService } from "@/services/authService";
import { onboardingService } from "@/services/onboardingService";

// Mock localStorage and sessionStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });
Object.defineProperty(global, "sessionStorage", { value: sessionStorageMock });

describe("Services Test Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  describe("Authentication Service (Mock Fallback)", () => {
    it("should allow a user to sign up and then sign in", async () => {
      const email = "test@voca.com";
      const password = "password123";
      const name = "Test User";

      // 1. Sign Up
      const signUpResult = await authService.signUpWithEmail(email, password, name);
      expect(signUpResult.user.email).toBe(email);
      expect(signUpResult.user.displayName).toBe(name);
      expect(signUpResult.user.uid).toBeDefined();

      // 2. Fetch current user (should be session-restored)
      const currentUser = authService.getCurrentUser();
      expect(currentUser).not.toBeNull();
      expect(currentUser?.email).toBe(email);

      // 3. Sign Out
      await authService.signOut();
      expect(authService.getCurrentUser()).toBeNull();

      // 4. Sign In
      const signInResult = await authService.signInWithEmail(email, password);
      expect(signInResult.user.email).toBe(email);
      expect(signInResult.user.displayName).toBe(name);
    });

    it("should reject sign in with incorrect password", async () => {
      const email = "test2@voca.com";
      const password = "password123";
      const name = "Test User 2";

      await authService.signUpWithEmail(email, password, name);

      await expect(
        authService.signInWithEmail(email, "wrongpassword")
      ).rejects.toThrow("Invalid email or password.");
    });

    it("should reject duplicate signups with the same email", async () => {
      const email = "test3@voca.com";
      const password = "password123";

      await authService.signUpWithEmail(email, password, "User A");

      await expect(
        authService.signUpWithEmail(email, password, "User B")
      ).rejects.toThrow("An account with this email already exists.");
    });
  });

  describe("Onboarding Service", () => {
    it("should save and retrieve onboarding sessions", async () => {
      const userId = "mock_user_123";
      const answers = [
        { question: "What kind of work pulls you in most?", answer: "Engineering" },
        { question: "What do you enjoy more day to day?", answer: "Building things" },
      ];

      // Verify initially null
      const initialSession = await onboardingService.getSession(userId);
      expect(initialSession).toBeNull();

      // Save
      await onboardingService.saveSession(userId, answers);

      // Retrieve and verify
      const retrieved = await onboardingService.getSession(userId);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.userId).toBe(userId);
      expect(retrieved?.answers).toEqual(answers);
      expect(retrieved?.completedAt).toBeDefined();

      // Clear
      await onboardingService.clearSession(userId);
      expect(await onboardingService.getSession(userId)).toBeNull();
    });
  });
});
