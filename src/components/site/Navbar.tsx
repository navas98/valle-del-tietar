import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogOut, Menu, ShieldCheck, UserRound, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

const links = [
  { label: "Descubre", hash: "descubre" },
  // "Historias" desactivada temporalmente junto con su sección (ver routes/index.tsx).
  // { label: "Historias", hash: "historias" },
  { label: "Pueblos", hash: "pueblos" },
  { label: "Ayudar", hash: "ayudar" },
];

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.38z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l3.99 3.1C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function AuthControls({ solid, mobile = false }: { solid: boolean; mobile?: boolean }) {
  const { user, profile, loading, requestSignIn, signOut } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => requestSignIn("login")}
          className={`text-sm font-semibold transition-opacity hover:opacity-70 ${
            solid ? "text-foreground" : "text-primary-foreground"
          }`}
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => requestSignIn("register")}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
            solid
              ? "border-border text-foreground hover:bg-secondary"
              : "border-primary-foreground/45 text-primary-foreground hover:bg-primary-foreground/12"
          }`}
        >
          <GoogleIcon />
          Registrarme
        </button>
      </div>
    );
  }

  if (mobile) {
    return (
      <div className="grid gap-1">
        {profile?.es_admin && (
          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-lg px-2 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            <ShieldCheck className="size-4" />
            Admin
          </Link>
        )}
        <Link
          to="/cuenta"
          className="block rounded-lg px-2 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
        >
          Perfil
        </Link>
        <button
          onClick={() => void signOut()}
          className="block rounded-lg px-2 py-3 text-left text-sm font-semibold text-foreground hover:bg-secondary"
        >
          Salir
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {profile?.es_admin && (
        <Link
          to="/admin"
          className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70 ${
            solid ? "text-foreground" : "text-primary-foreground"
          }`}
        >
          <ShieldCheck className="size-4" />
          Admin
        </Link>
      )}
      <Link
        to="/cuenta"
        className="flex items-center gap-3 rounded-lg transition-opacity hover:opacity-70"
        aria-label="Ver mi cuenta"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.nombre}
            width={32}
            height={32}
            className={`size-8 rounded-full object-cover ring-2 ${solid ? "ring-secondary" : "ring-primary-foreground/40"}`}
          />
        ) : (
          <div
            className={`flex size-8 items-center justify-center rounded-full ring-2 ${
              solid
                ? "bg-secondary ring-secondary text-muted-foreground"
                : "bg-primary-foreground/15 ring-primary-foreground/40 text-primary-foreground"
            }`}
          >
            <UserRound className="size-4" />
          </div>
        )}
        <span
          className={`text-sm font-semibold ${solid ? "text-foreground" : "text-primary-foreground"}`}
        >
          {profile?.nombre ?? user.email}
        </span>
      </Link>
      <button
        onClick={() => void signOut()}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className={`transition-opacity hover:opacity-70 ${solid ? "text-muted-foreground" : "text-primary-foreground/80"}`}
      >
        <LogOut className="size-4" />
      </button>
    </div>
  );
}

export function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-border/70 bg-background/90 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="container-page flex h-18 items-center justify-between gap-6 py-4">
        <Link
          to="/"
          hash="top"
          className={`text-[1.0625rem] font-extrabold tracking-tight transition-colors ${
            solid ? "text-primary" : "text-primary-foreground"
          }`}
        >
          Salvar el valle
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to="/"
                hash={l.hash}
                className={`text-sm font-semibold transition-opacity hover:opacity-70 ${
                  solid ? "text-foreground" : "text-primary-foreground"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center lg:flex">
          <AuthControls solid={solid} />
        </div>

        <button
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
          className={`lg:hidden ${solid ? "text-foreground" : "text-primary-foreground"}`}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-6 pb-6 pt-2 lg:hidden">
          <ul className="grid gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to="/"
                  hash={l.hash}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <AuthControls solid mobile />
          </div>
        </div>
      )}
    </header>
  );
}
