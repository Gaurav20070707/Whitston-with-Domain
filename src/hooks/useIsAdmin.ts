"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirebaseFirestore } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";

/**
 * Whether the signed-in user has a document at /admins/{uid}. This is a
 * convenience for the UI (which panels to show) — the actual permission
 * boundary is firestore.rules, which runs the identical check server-side
 * on every read and write, so a user can't get admin powers just by
 * spoofing this hook's return value in the browser.
 */
export function useIsAdmin(): { isAdmin: boolean; isLoading: boolean } {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const ref = doc(getFirebaseFirestore(), "admins", user.uid);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        setIsAdmin(snap.exists());
        setIsLoading(false);
      },
      () => {
        // Rules deny a non-admin reading /admins/{other-uid}, but reading
        // your own doc is always allowed for any signed-in user (see
        // firestore.rules), so a permission error here just means "no".
        setIsAdmin(false);
        setIsLoading(false);
      },
    );
    return unsubscribe;
  }, [user, authLoading]);

  return { isAdmin, isLoading: authLoading || isLoading };
}
