import type { ActionCodeSettings } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let firebasePromise: ReturnType<typeof initializeFirebase> | undefined;

async function initializeFirebase() {
  if (!isFirebaseConfigured) throw new Error("Firebase is not configured");
  const [appModule, authModule] = await Promise.all([
    import("firebase/app"),
    import("firebase/auth"),
  ]);
  const app = appModule.getApps().length
    ? appModule.getApp()
    : appModule.initializeApp(firebaseConfig);
  const auth = authModule.getAuth(app);
  const googleProvider = new authModule.GoogleAuthProvider();
  return { app, auth, googleProvider, authModule };
}

/** Firebase is downloaded only when a login/reset action needs it. */
export function loadFirebase() {
  firebasePromise ??= initializeFirebase();
  return firebasePromise;
}

export function getPasswordResetActionCodeSettings(): ActionCodeSettings | undefined {
  if (typeof window === "undefined") return undefined;
  return { url: `${window.location.origin}/login`, handleCodeInApp: false };
}
