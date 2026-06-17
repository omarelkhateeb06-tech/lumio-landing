import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { startSession, endSession } from "@/lib/analytics";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithMagicLink: (email: string, redirectPath?: string) => Promise<{ ok: boolean; error?: string; status?: number }>;
  signOut: () => Promise<void>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Resolve the initial session, then subscribe to future changes.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Behavioral analytics session lifecycle. Once a user is authenticated, open a
  // capture session and arrange to close it when the page goes away. Both writes
  // are best-effort/fire-and-forget and must never disrupt auth or the UX. Keyed
  // on the user id so it runs once per signed-in user and tears down on sign-out.
  useEffect(() => {
    if (!user || !session) return;
    void startSession();
    // Close the session on the two reliable "page is going away" signals: a
    // pagehide (covers tab close, navigation, bfcache) and the tab becoming
    // hidden. endSession() is idempotent, so a double-fire is harmless.
    const onHidden = () => {
      if (document.visibilityState === "hidden") void endSession();
    };
    const onPageHide = () => {
      void endSession();
    };
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onHidden);
      void endSession();
    };
  }, [user?.id, session]);

  async function signInWithMagicLink(
    email: string,
    redirectPath?: string
  ): Promise<{ ok: boolean; error?: string; status?: number }> {
    // Only honor internal, same-origin paths so a cert-intent signup lands on
    // that cert after auth (Executor M1) without becoming an open-redirect vector.
    const safePath = redirectPath && redirectPath.startsWith("/") && !redirectPath.startsWith("//")
      ? redirectPath
      : "/app";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + safePath,
      },
    });
    if (error) return { ok: false, error: error.message, status: error.status };
    return { ok: true };
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithMagicLink, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
