"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User as FirebaseUser, ConfirmationResult } from "firebase/auth";
import { isFirebaseConfigured, loadFirebase } from "@/lib/firebase";
import { api, ApiError, isBackendUnavailable } from "@/lib/api";
import { flushPendingExamAttempt } from "@/lib/pending-exam";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: string;
  mobile?: string;
  className?: string;
  level?: string;
  group?: string;
  district?: string;
  schoolName?: string;
  collegeName?: string;
  collegeEiin?: string;
  batch?: string;
  examYear?: string | number;
  targetExamYear?: string | number;
  favoriteSubject?: string;
  weakSubjects?: string;
  score?: number;
  rank?: number | null;
  badge?: string;
  elo?: number;
  streak?: number;
  profileComplete?: boolean;
  isPremium?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  backendStatus: "checking" | "up" | "down";
  retryBackend: () => Promise<void>;
  loginWithGoogle: () => Promise<UserProfile | null>;
  loginWithEmail: (email: string, pass: string) => Promise<UserProfile | null>;
  registerWithEmail: (
    email: string,
    pass: string,
    name: string,
  ) => Promise<UserProfile | null>;
  sendPhoneOtp: (phoneNumber: string, elementId: string) => Promise<ConfirmationResult>;
  logout: () => Promise<void>;
  syncProfile: (details: Partial<UserProfile>) => Promise<void>;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function backendSyncErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 503 || err.status === 502) {
      return process.env.NODE_ENV === "development"
        ? "লোকাল API চালু নেই। ডেভেলপমেন্ট সার্ভারটি চালু করে আবার চেষ্টা করুন।"
        : "সাইন-ইন সেবা সাময়িকভাবে পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।";
    }
    if (err.status === 500 && /failed \(|ECONNREFUSED|fetch/i.test(err.message)) {
      return process.env.NODE_ENV === "development"
        ? "লোকাল API-তে সংযোগ করা যায়নি।"
        : "সার্ভারের সঙ্গে সংযোগ করা যায়নি। আবার চেষ্টা করুন।";
    }
    if (err.status === 401) {
      return "Firebase token যাচাই ব্যর্থ। আবার লগইন করুন।";
    }
    return err.message;
  }
  return "সার্ভার সিনক্রোনাইজেশন ব্যর্থ হয়েছে।";
}

function firebaseLoginErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = String((err as { code: unknown }).code);
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে।";
      case "auth/invalid-email":
        return "ইমেইল ঠিক নয়।";
      case "auth/too-many-requests":
        return "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";
      case "auth/user-disabled":
        return "এই অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে।";
      default:
        console.error("[firebase-login]", code);
        return "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
    }
  }
  return "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<"checking" | "up" | "down">("checking");

  const checkBackend = async () => {
    setBackendStatus("checking");
    const isAvailable = await api.checkBackend();
    setBackendStatus(isAvailable ? "up" : "down");
  };

  const retryBackend = async () => {
    setBackendStatus("checking");
    setError(null);
    await checkBackend();
  };

  const fetchFullProfile = async (): Promise<UserProfile | null> => {
    try {
      const me = await api.get<{ user: UserProfile | null }>("/api/auth/me");
      setBackendStatus("up");
      if (me.user) {
        setUser(me.user);
        return me.user;
      }
      return null;
    } catch (err) {
      console.error("Profile hydrate failed:", err);
      if (isBackendUnavailable(err)) setBackendStatus("down");
      return null;
    }
  };

  const syncWithBackend = async (
    fUser: FirebaseUser,
  ): Promise<UserProfile | null> => {
    try {
      const idToken = await fUser.getIdToken();
      const data = await api.post<{ user: UserProfile }>("/api/auth/firebase", {
        idToken,
      });
      setBackendStatus("up");
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message = backendSyncErrorMessage(err);
      console.error("Auth sync error:", err);
      setError(message);
      return null;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await api.get<{ user: UserProfile | null }>("/api/auth/me");
        setBackendStatus("up");
        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        if (isBackendUnavailable(err)) setBackendStatus("down");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const loginWithGoogle = async (): Promise<UserProfile | null> => {
    if (!isFirebaseConfigured) {
      setError("Firebase কনফিগার করা নেই। .env.local চেক করুন।");
      return null;
    }
    setError(null);
    setLoading(true);
    try {
      const { auth, googleProvider, authModule } = await loadFirebase();
      const cred = await authModule.signInWithPopup(auth, googleProvider);
      return await syncWithBackend(cred.user);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "গুগল লগইন ব্যর্থ হয়েছে।";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (
    email: string,
    pass: string,
  ): Promise<UserProfile | null> => {
    if (!isFirebaseConfigured) {
      setError("Firebase কনফিগার করা নেই। .env.local চেক করুন।");
      return null;
    }
    setError(null);
    setLoading(true);
    try {
      const { auth, authModule } = await loadFirebase();
      const cred = await authModule.signInWithEmailAndPassword(auth, email, pass);
      return await syncWithBackend(cred.user);
    } catch (err: unknown) {
      setError(firebaseLoginErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    name: string,
  ): Promise<UserProfile | null> => {
    if (!isFirebaseConfigured) {
      setError("Firebase কনফিগার করা নেই। .env.local চেক করুন।");
      return null;
    }
    setError(null);
    setLoading(true);
    try {
      const { auth, authModule } = await loadFirebase();
      const cred = await authModule.createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        const trimmedName = name.trim();
        if (trimmedName) {
          await authModule.updateProfile(cred.user, { displayName: trimmedName });
        }
        return await syncWithBackend(cred.user);
      }
      return null;
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: string }).code)
          : "";
      setError(
        code === "auth/email-already-in-use"
          ? "ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে।"
          : "অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে।",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneOtp = async (phoneNumber: string, elementId: string) => {
    if (!isFirebaseConfigured) {
      setError("Firebase কনফিগার করা নেই। .env.local চেক করুন।");
      throw new Error("firebase not configured");
    }
    setError(null);
    try {
      const { auth, authModule } = await loadFirebase();
      const verifier = new authModule.RecaptchaVerifier(auth, elementId, {
        size: "invisible",
      });
      return await authModule.signInWithPhoneNumber(auth, phoneNumber, verifier);
    } catch {
      setError("ওটিপি পাঠাতে সমস্যা হয়েছে। সঠিক নম্বর ব্যবহার করুন।");
      throw new Error("otp failed");
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isFirebaseConfigured) {
        const { auth, authModule } = await loadFirebase();
        await authModule.signOut(auth);
      }
    } catch (err) {
      console.error("Firebase signOut failed:", err);
    }

    setUser(null);

    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Session cookie clear failed:", err);
    }

    setLoading(false);
    router.replace("/login");
  };

  const syncProfile = async (details: Partial<UserProfile>) => {
    try {
      setLoading(true);
      const result = await api.put<{ ok: boolean; user?: UserProfile }>(
        "/api/student/profile",
        details,
      );
      if (result.user) {
        setUser(result.user);
        await flushPendingExamAttempt();
      } else {
        setUser((prev) => (prev ? { ...prev, ...details } : null));
      }
    } catch {
      setError("প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।");
      throw new Error("profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      error,
      backendStatus,
      retryBackend,
      loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        sendPhoneOtp,
        logout,
        syncProfile,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
