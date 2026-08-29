import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { signInWithOAuth } = vi.hoisted(() => ({
  signInWithOAuth: vi.fn().mockResolvedValue({}),
}));

vi.mock("./supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      signInWithOAuth,
      signOut: vi.fn(),
    },
  },
}));

import { AuthProvider, useAuth } from "./auth";

function AuthHarness() {
  const { requestSignIn, termsIntent, confirmTerms } = useAuth();

  return (
    <>
      <span data-testid="intent">{termsIntent ?? "none"}</span>
      <button onClick={() => requestSignIn("login")}>Entrar</button>
      <button onClick={() => requestSignIn("register")}>Registrarse</button>
      <button onClick={() => void confirmTerms()}>Aceptar</button>
    </>
  );
}

describe("AuthProvider Google OAuth", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
      clear: () => values.clear(),
    });
    signInWithOAuth.mockClear();
  });

  it.each([
    ["Entrar", "login"],
    ["Registrarse", "register"],
  ])("exige consentimiento antes de %s", (button, intent) => {
    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: button }));

    expect(screen.getByTestId("intent")).toHaveTextContent(intent);
    expect(signInWithOAuth).not.toHaveBeenCalled();
  });

  it("conserva la intención y abre Google solo después de aceptar", async () => {
    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    fireEvent.click(screen.getByRole("button", { name: "Aceptar" }));

    await waitFor(() => expect(signInWithOAuth).toHaveBeenCalledOnce());
    expect(localStorage.getItem("sotillo_auth_intent")).toBe("login");
  });
});
