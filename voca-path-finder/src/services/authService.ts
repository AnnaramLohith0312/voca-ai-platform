// src/services/authService.ts
// Service abstraction supporting both Live Firebase Auth and Mock Local fallback.
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import type { IAuthService, AuthUser, AuthResult } from "./interfaces";

export type { AuthUser, AuthResult };

// Helper to map Firebase User object to custom VOCA AuthUser type
function mapFirebaseUser(user: FirebaseUser): AuthUser {
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName,
  };
}

// ── Mock store ──────────────────────────────────────────────────
const MOCK_USERS_KEY = "voca_mock_users";
const MOCK_SESSION_KEY = "voca_mock_session";

interface MockUserRecord {
  password?: string;
  displayName?: string;
}

function getMockUsers(): Record<string, MockUserRecord> {
  try {
    return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function setMockUser(email: string, password: string, displayName: string) {
  const users = getMockUsers();
  users[email] = { password, displayName };
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function getMockSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(MOCK_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setMockSession(user: AuthUser | null) {
  if (user) {
    sessionStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
  } else {
    sessionStorage.removeItem(MOCK_SESSION_KEY);
  }
}

function makeUid(email: string) {
  return "mock_" + btoa(email).replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);
}

// ── Auth Service ────────────────────────────────────────────────
let _onAuthChangeCallback: ((user: AuthUser | null) => void) | null = null;

function notifyAuthChange(user: AuthUser | null) {
  if (_onAuthChangeCallback) _onAuthChangeCallback(user);
}

export const authService: IAuthService = {
  async signUpWithEmail(
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthResult> {
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        const user = mapFirebaseUser(userCredential.user);
        return { user };
      } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : "Failed to sign up.");
      }
    } else {
      const users = getMockUsers();
      if (users[email]) {
        throw new Error("An account with this email already exists.");
      }
      setMockUser(email, password, displayName);
      const user: AuthUser = {
        uid: makeUid(email),
        email,
        displayName,
      };
      setMockSession(user);
      notifyAuthChange(user);
      return { user };
    }
  },

  async signInWithEmail(
    email: string,
    password: string
  ): Promise<AuthResult> {
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = mapFirebaseUser(userCredential.user);
        return { user };
      } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : "Failed to sign in.");
      }
    } else {
      const users = getMockUsers();
      const record = users[email];
      if (!record || record.password !== password) {
        throw new Error("Invalid email or password.");
      }
      const user: AuthUser = {
        uid: makeUid(email),
        email,
        displayName: record.displayName || null,
      };
      setMockSession(user);
      notifyAuthChange(user);
      return { user };
    }
  },

  async signOut(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    } else {
      setMockSession(null);
      notifyAuthChange(null);
    }
  },

  async sendPasswordResetEmail(email: string): Promise<void> {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSendPasswordResetEmail(auth, email);
      } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : "Failed to send password reset email.");
      }
    } else {
      const users = getMockUsers();
      if (!users[email]) {
        // Silently succeed for security
      }
      return;
    }
  },

  getCurrentUser(): AuthUser | null {
    if (isFirebaseConfigured && auth) {
      return auth.currentUser ? mapFirebaseUser(auth.currentUser) : null;
    }
    return getMockSession();
  },

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = firebaseOnAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          callback(mapFirebaseUser(firebaseUser));
        } else {
          callback(null);
        }
      });
      return unsubscribe;
    } else {
      _onAuthChangeCallback = callback;
      // Trigger callback with current session status asynchronously
      setTimeout(() => callback(getMockSession()), 0);
      return () => {
        _onAuthChangeCallback = null;
      };
    }
  },
};
