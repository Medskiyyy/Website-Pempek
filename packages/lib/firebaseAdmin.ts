import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
      });
    } catch (e) {
      console.error("Failed to parse service account key, initializing default app:", e);
      admin.initializeApp();
    }
  } else {
    // Try default configuration (useful if running in Google Cloud or local firebase environment)
    try {
      admin.initializeApp();
    } catch (e) {
      console.warn("Firebase Admin SDK failed to initialize. Make sure service account configs are loaded.");
    }
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminStorage = admin.apps.length ? admin.storage() : null;
export default admin;
