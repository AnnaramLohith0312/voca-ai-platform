// src/services/authService.ts
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { adminAuth, adminDb, isAdminConfigured } from "@/lib/firebaseAdmin";
import { DbUser } from "@/models/user";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";

// Local mock storage for users
const mockUserStore = new Map<string, DbUser>();
const mockPasswordStore = new Map<string, string>(); // mock email -> password for sign-in validation

export const authService = {
  /**
   * Verifies a Firebase ID token and retrieves/persists their Firestore profile.
   */
  async verifyIdToken(token: string): Promise<DbUser> {
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    if (isAdminConfigured && adminAuth) {
      try {
        const decodedToken = await adminAuth.verifyIdToken(cleanToken);
        const uid = decodedToken.uid;
        
        let profile = await this.getUserProfile(uid);
        if (!profile) {
          profile = await this.createUserProfile(uid, {
            email: decodedToken.email || "",
            displayName: decodedToken.name || null,
          });
        }
        return profile;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Invalid authentication token.");
      }
    } else {
      if (!cleanToken || !cleanToken.startsWith("mock_")) {
        throw new Error("Invalid authorization token. Provide a live Firebase ID token, or prefix with 'mock_' during mock authentication.");
      }
      
      let profile = mockUserStore.get(cleanToken);
      if (!profile) {
        const username = cleanToken.replace("mock_", "");
        profile = {
          uid: cleanToken,
          email: `${username}@voca-mock.com`,
          displayName: username.charAt(0).toUpperCase() + username.slice(1) + " (Mock)",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockUserStore.set(cleanToken, profile);
      }
      return profile;
    }
  },

  /**
   * Signs up a new user using email and password, then creates a Firestore profile.
   */
  async signUp(email: string, password: string, displayName?: string): Promise<DbUser> {
    if (isFirebaseConfigured && auth && isAdminConfigured && adminDb) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (displayName) {
          await updateProfile(user, { displayName });
        }

        const profile = await this.createUserProfile(user.uid, {
          email: user.email || email,
          displayName: displayName || null,
        });

        return profile;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to sign up.");
      }
    } else {
      // Mock Sign Up
      const lowercaseEmail = email.toLowerCase();
      if (Array.from(mockUserStore.values()).some((u) => u.email.toLowerCase() === lowercaseEmail)) {
        throw new Error("auth/email-already-in-use");
      }

      const uid = `mock_${lowercaseEmail.split("@")[0]}`;
      const profile: DbUser = {
        uid,
        email,
        displayName: displayName || lowercaseEmail.split("@")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockUserStore.set(uid, profile);
      mockPasswordStore.set(lowercaseEmail, password);
      return profile;
    }
  },

  /**
   * Signs in a user using email and password, retrieving the user and ID token.
   */
  async signIn(email: string, password: string): Promise<{ user: DbUser; token: string }> {
    if (isFirebaseConfigured && auth && isAdminConfigured && adminDb) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        let profile = await this.getUserProfile(user.uid);
        if (!profile) {
          profile = await this.createUserProfile(user.uid, {
            email: user.email || email,
            displayName: user.displayName || null,
          });
        }

        return { user: profile, token };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to sign in.");
      }
    } else {
      // Mock Sign In
      const lowercaseEmail = email.toLowerCase();
      const existingUser = Array.from(mockUserStore.values()).find((u) => u.email.toLowerCase() === lowercaseEmail);
      const correctPassword = mockPasswordStore.get(lowercaseEmail);

      if (!existingUser || correctPassword !== password) {
        // Create dynamic user for local development convenience if password is 'password'
        if (password === "password" || password === "mock_password") {
          const uid = `mock_${lowercaseEmail.split("@")[0]}`;
          const profile: DbUser = {
            uid,
            email,
            displayName: lowercaseEmail.split("@")[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          mockUserStore.set(uid, profile);
          mockPasswordStore.set(lowercaseEmail, password);
          return { user: profile, token: uid };
        }
        throw new Error("auth/wrong-password");
      }

      return { user: existingUser, token: existingUser.uid };
    }
  },

  /**
   * Signs out the currently authenticated user from client Firebase Auth.
   */
  async signOutUser(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
  },

  /**
   * Sends a password reset email.
   */
  async resetPassword(email: string): Promise<void> {
    if (isFirebaseConfigured && auth) {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to send password reset email.");
      }
    } else {
      // Mock Reset Password
      console.log(`Mock reset password email sent to ${email}`);
    }
  },

  /**
   * Fetches user profile from Firestore collection `users`.
   */
  async getUserProfile(userId: string): Promise<DbUser | null> {
    if (isAdminConfigured && adminDb) {
      try {
        const docSnap = await adminDb.collection("users").doc(userId).get();
        if (!docSnap.exists) return null;
        return docSnap.data() as DbUser;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to fetch user profile.");
      }
    } else {
      return mockUserStore.get(userId) || null;
    }
  },

  /**
   * Creates a user profile document in Firestore collection `users`.
   */
  async createUserProfile(userId: string, data: Partial<DbUser>): Promise<DbUser> {
    const profile: DbUser = {
      uid: userId,
      email: data.email || "",
      displayName: data.displayName || null,
      role: data.role || "user",
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isAdminConfigured && adminDb) {
      try {
        await adminDb.collection("users").doc(userId).set(profile);
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to create user profile.");
      }
    } else {
      mockUserStore.set(userId, profile);
    }

    return profile;
  },

  /**
   * Merges updates into user profile document in Firestore.
   */
  async updateUserProfile(userId: string, data: Partial<DbUser>): Promise<DbUser> {
    let existing = await this.getUserProfile(userId);
    if (!existing) {
      existing = await this.createUserProfile(userId, data);
    }

    const updatedProfile: DbUser = {
      ...existing,
      ...data,
      uid: userId, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString(),
    };

    if (isAdminConfigured && adminDb) {
      try {
        await adminDb.collection("users").doc(userId).set(updatedProfile, { merge: true });
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to update user profile.");
      }
    } else {
      mockUserStore.set(userId, updatedProfile);
    }

    return updatedProfile;
  }
};
