"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppUser } from "@/types";
import { signInWithGoogle, signOutUser, subscribeToAuthChanges } from "@/firebase/auth";

interface AuthContextValue {
  user: AppUser | null;
  /** True until the initial Firebase auth check resolves. */
  isLoading: boolean;
  /** Set when a sign-in/sign-out call throws. Cleared on the next action. */
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Firebase persists sessions in localStorage by default, so this fires
    // with the restored user (if any) almost immediately on refresh.
    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    setError(null);
    try {
      const signedInUser = await signInWithGoogle();
      setUser(signedInUser);
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError("Sign-in didn't go through. Please try again.");
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await signOutUser();
      setUser(null);
    } catch (err) {
      console.error("Sign-out failed:", err);
      setError("Couldn't sign out. Please try again.");
    }
  };

  const value = useMemo(
    () => ({ user, isLoading, error, signIn, signOut }),
    [user, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
