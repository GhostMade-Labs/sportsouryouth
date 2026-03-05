import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY must be valid JSON");
  }
}

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(getServiceAccount()),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });

export const adminDb = getFirestore(app);
