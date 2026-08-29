import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const INTENT_KEY = "sotillo_auth_intent";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  /**
   * Abre el consentimiento previo al login de Google. Supabase puede crear una
   * cuenta desde el mismo flujo OAuth, así que ambos intentos deben aceptarlo.
   */
  requestSignIn: (intent: "login" | "register") => void;
  /** Intención pendiente mientras el diálogo de consentimiento está abierto. */
  termsIntent: "login" | "register" | null;
  /** El usuario ha aceptado los Términos: continúa con Google. */
  confirmTerms: () => Promise<void>;
  /** El usuario cierra el diálogo sin aceptar: no se registra. */
  cancelTerms: () => void;
  signOut: () => Promise<void>;
  setRole: (role: "cliente" | "comercio") => Promise<void>;
  updateProfile: (
    updates: Partial<
      Pick<
        Profile,
        | "nombre"
        | "avatar_url"
        | "municipio"
        | "fecha_nacimiento"
        | "pueblo_interes"
        | "interes_principal"
      >
    >,
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [termsIntent, setTermsIntent] = useState<"login" | "register" | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    let cancelled = false;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        if (!cancelled) setProfile(data);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  async function startGoogleOAuth(intent: "login" | "register") {
    localStorage.setItem(INTENT_KEY, intent);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: "select_account" },
      },
    });
  }

  // Google OAuth no distingue de antemano entre login y registro: si la cuenta
  // no existe, Supabase la crea. Por eso ambos caminos exigen consentimiento.
  function requestSignIn(intent: "login" | "register") {
    setTermsIntent(intent);
  }

  function cancelTerms() {
    setTermsIntent(null);
  }

  async function confirmTerms() {
    if (!termsIntent) return;
    const intent = termsIntent;
    setTermsIntent(null);
    await startGoogleOAuth(intent);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function updateProfile(
    updates: Partial<
      Pick<
        Profile,
        | "nombre"
        | "avatar_url"
        | "municipio"
        | "fecha_nacimiento"
        | "pueblo_interes"
        | "interes_principal"
      >
    >,
  ) {
    if (!session?.user) return;
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", session.user.id)
      .select("*")
      .single();
    if (error) throw error;
    if (data) setProfile(data);
  }

  async function setRole(role: "cliente" | "comercio") {
    if (!session?.user) return;
    const { data } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", session.user.id)
      .select("*")
      .single();
    if (data) setProfile(data);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        requestSignIn,
        termsIntent,
        confirmTerms,
        cancelTerms,
        signOut,
        setRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
