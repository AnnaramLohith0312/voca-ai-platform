// src/lib/firebaseAdmin.ts
import * as admin from "firebase-admin";

let adminApp: admin.app.App | null = null;
let isAdminConfigured = false;

try {
  if (admin.apps.length > 0) {
    adminApp = admin.apps[0]!;
    isAdminConfigured = true;
  } else {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (projectId && clientEmail && privateKey) {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
      isAdminConfigured = true;
    } else if (projectId) {
      // Fallback for environment-default credentials (e.g. Cloud Run, App Hosting)
      adminApp = admin.initializeApp();
      isAdminConfigured = true;
    }
  }
} catch (error) {
  console.warn("Firebase Admin SDK failed to initialize. Active collection transactions will use mock fallbacks.", error);
}

export const adminAuth = isAdminConfigured && adminApp ? adminApp.auth() : null;
export const adminDb = isAdminConfigured && adminApp ? adminApp.firestore() : null;
export { isAdminConfigured };
export default admin;
