import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BadgeCheck, ExternalLink, Store, Trash2, UserRound } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  aprobarNegocio,
  eliminarNegocio,
  fetchNegociosAdmin,
  retirarNegocio,
  type Negocio,
} from "@/lib/negocios";
import { eliminarUsuario, fetchUsuariosAdmin, type Profile } from "@/lib/admin";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administración — Salvar el valle" }] }),
  component: AdminPage,
});

type Tab = "negocios" | "usuarios";

function AdminPage() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("negocios");

  useEffect(() => {
    if (!loading && !profile?.es_admin) void navigate({ to: "/" });
  }, [loading, profile, navigate]);

  const { data: negocios = [] } = useQuery({
    queryKey: ["admin-negocios"],
    queryFn: fetchNegociosAdmin,
    enabled: Boolean(profile?.es_admin),
  });

  const { data: usuarios = [] } = useQuery({
    queryKey: ["admin-usuarios"],
    queryFn: fetchUsuariosAdmin,
    enabled: Boolean(profile?.es_admin),
  });

  if (loading || !profile?.es_admin) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pb-24 pt-32 sm:pt-36" />
        <Footer />
      </>
    );
  }

  const pendientes = negocios.filter((n) => !n.aprobado);
  const publicados = negocios.filter((n) => n.aprobado);

  async function toggleAprobado(n: Negocio) {
    try {
      if (n.aprobado) {
        await retirarNegocio(n.id);
        toast.success(`"${n.nombre}" retirado de la web`);
      } else {
        await aprobarNegocio(n.id);
        toast.success(`"${n.nombre}" aprobado`);
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-negocios"] });
      await queryClient.invalidateQueries({ queryKey: ["negocios"] });
    } catch {
      toast.error("No se ha podido actualizar el negocio");
    }
  }

  async function handleEliminarNegocio(n: Negocio) {
    if (!window.confirm(`¿Borrar "${n.nombre}" para siempre? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await eliminarNegocio(n.id);
      toast.success(`"${n.nombre}" borrado`);
      await queryClient.invalidateQueries({ queryKey: ["admin-negocios"] });
      await queryClient.invalidateQueries({ queryKey: ["negocios"] });
    } catch {
      toast.error("No se ha podido borrar el negocio");
    }
  }

  async function handleEliminarUsuario(u: Profile) {
    if (
      !window.confirm(
        `¿Borrar la cuenta de "${u.nombre}" para siempre? Se borrará también su negocio y sus favoritos. Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    try {
      await eliminarUsuario(u.id);
      toast.success(`Cuenta de "${u.nombre}" borrada`);
      await queryClient.invalidateQueries({ queryKey: ["admin-usuarios"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-negocios"] });
      await queryClient.invalidateQueries({ queryKey: ["negocios"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se ha podido borrar la cuenta");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-24 pt-28 sm:pt-32">
        <div className="container-page max-w-4xl">
          <h1 className="font-serif text-3xl font-semibold">Administración</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aprueba negocios nuevos antes de que aparezcan en la web y consulta el estado de
            usuarios y negocios.
          </p>

          <div className="mt-8 flex gap-6 border-b border-border">
            <button
              onClick={() => setTab("negocios")}
              className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
                tab === "negocios"
                  ? "border-forest text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Negocios ({negocios.length})
            </button>
            <button
              onClick={() => setTab("usuarios")}
              className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
                tab === "usuarios"
                  ? "border-forest text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Usuarios ({usuarios.length})
            </button>
          </div>

          <div className="mt-6">
            {tab === "negocios" && (
              <div className="space-y-8">
                {pendientes.length > 0 && (
                  <section>
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-terracotta">
                      Pendientes de aprobación ({pendientes.length})
                    </h2>
                    <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
                      {pendientes.map((n) => (
                        <FilaNegocio
                          key={n.id}
                          n={n}
                          onToggle={() => void toggleAprobado(n)}
                          onEliminar={() => void handleEliminarNegocio(n)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Publicados ({publicados.length})
                  </h2>
                  <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
                    {publicados.length === 0 ? (
                      <p className="p-4 text-sm text-muted-foreground">
                        Todavía no hay negocios publicados.
                      </p>
                    ) : (
                      publicados.map((n) => (
                        <FilaNegocio
                          key={n.id}
                          n={n}
                          onToggle={() => void toggleAprobado(n)}
                          onEliminar={() => void handleEliminarNegocio(n)}
                        />
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}

            {tab === "usuarios" && (
              <div className="divide-y divide-border rounded-2xl border border-border bg-card">
                {usuarios.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">Todavía no hay usuarios.</p>
                ) : (
                  usuarios.map((u) => (
                    <FilaUsuario
                      key={u.id}
                      u={u}
                      esUnoMismo={u.id === profile.id}
                      onEliminar={() => void handleEliminarUsuario(u)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function FilaNegocio({
  n,
  onToggle,
  onEliminar,
}: {
  n: Negocio;
  onToggle: () => void;
  onEliminar: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
          {n.imagen ? (
            <img src={n.imagen} alt="" className="size-full object-cover" />
          ) : (
            <Store className="size-4 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{n.nombre}</p>
          <p className="truncate text-xs text-muted-foreground">
            {n.categoria} · {n.municipio}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Link
          to="/negocio/$id"
          params={{ id: n.id }}
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Ver ficha"
        >
          <ExternalLink className="size-4" />
        </Link>
        <button
          onClick={onToggle}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            n.aprobado
              ? "border border-border text-muted-foreground hover:bg-secondary"
              : "bg-accent text-accent-foreground hover:bg-accent/90"
          }`}
        >
          {n.aprobado ? "Retirar" : "Aprobar"}
        </button>
        <button
          onClick={onEliminar}
          aria-label={`Borrar ${n.nombre}`}
          className="text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}

function FilaUsuario({
  u,
  esUnoMismo,
  onEliminar,
}: {
  u: Profile;
  esUnoMismo: boolean;
  onEliminar: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary">
          {u.avatar_url ? (
            <img src={u.avatar_url} alt="" className="size-full object-cover" />
          ) : (
            <UserRound className="size-4 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {u.nombre}
            {esUnoMismo && <span className="ml-1.5 text-xs text-muted-foreground">(tú)</span>}
          </p>
          {u.email && <p className="truncate text-xs text-muted-foreground">{u.email}</p>}
          <p className="text-xs text-muted-foreground">
            {u.role === "comercio" ? "Negocio" : u.role === "cliente" ? "Visitante" : "Sin rol"} ·
            desde {new Date(u.created_at).toLocaleDateString("es-ES")}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {u.distintivo && <BadgeCheck className="size-4 text-forest" />}
        {!esUnoMismo && (
          <button
            onClick={onEliminar}
            aria-label={`Borrar la cuenta de ${u.nombre}`}
            className="text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
