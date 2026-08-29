import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  Camera,
  Clock,
  ExternalLink,
  Facebook,
  Globe,
  Heart,
  Images,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  PlusCircle,
  Store,
  Tag,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { fechaCorta, fechaRelativa } from "@/lib/format";
import {
  MUNICIPIOS_DISPONIBLES,
  contarFavoritosDeNegocio,
  fetchMiNegocio,
  fetchMisFavoritos,
  quitarFavorito,
  subirArchivoNegocio,
  type Negocio,
} from "@/lib/negocios";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MiNegocioDialog } from "@/components/site/MiNegocioDialog";
import { Ampliable, Lightbox, useLightbox } from "@/components/site/Lightbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroValle from "@/assets/hero-valle.jpg";

// Mismo acento por categoría que en el listado del Valle.
const CATEGORIA_ACENTOS: Record<string, string> = {
  Pueblos: "#c1502e",
  Naturaleza: "#4c6a3f",
  Comer: "#c1502e",
  Dormir: "#b9902e",
  "Qué hacer": "#4c6a3f",
  "Comercio local": "#b9902e",
};

export const Route = createFileRoute("/cuenta")({
  head: () => ({ meta: [{ title: "Mi cuenta — Salvar el valle" }] }),
  component: CuentaPage,
});

function CuentaPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/" });
  }, [loading, user, navigate]);

  if (loading || !user || !profile) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pb-24 pt-32 sm:pt-36" />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen">
        <img src={heroValle} alt="" className="fixed inset-0 -z-10 size-full object-cover" />
        <div className="fixed inset-0 -z-10 bg-[oklch(0.14_0.02_60/0.45)]" />

        <div className="container-page relative pt-24 sm:pt-28">
          <div className="mx-auto flex max-w-4xl items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/90 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="size-4" />
              Volver al Valle
            </Link>
          </div>
        </div>

        <div className="container-page pb-24 pt-10 sm:pt-16">
          <div className="mx-auto max-w-4xl">
            {profile.role === "comercio" ? <PerfilEmpresa userId={user.id} /> : <PerfilUsuario />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// ————————————————————————————————————————————————————————————————
// Perfil de usuario (visitante)
// ————————————————————————————————————————————————————————————————

type TabUsuario = "favoritos" | "actividad" | "configuracion";

function PerfilUsuario() {
  const { user, profile, updateProfile } = useAuth();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<TabUsuario>("favoritos");
  const [nombre, setNombre] = useState(profile?.nombre ?? "");
  const [editingNombre, setEditingNombre] = useState(false);
  const [savingNombre, setSavingNombre] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const nombreInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) setNombre(profile.nombre);
  }, [profile]);

  const { data: favoritos = [] } = useQuery({
    queryKey: ["mis-favoritos", user?.id],
    queryFn: () => fetchMisFavoritos(user!.id),
    enabled: Boolean(user),
  });

  if (!user || !profile) return null;

  async function guardarNombre() {
    const limpio = nombre.trim();
    if (!profile || !limpio || limpio === profile.nombre) {
      setNombre(profile?.nombre ?? "");
      setEditingNombre(false);
      return;
    }
    setSavingNombre(true);
    try {
      await updateProfile({ nombre: limpio });
    } catch {
      toast.error("No se ha podido guardar el nombre");
      setNombre(profile.nombre);
    } finally {
      setSavingNombre(false);
      setEditingNombre(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    setUploadingAvatar(true);
    try {
      const avatar_url = await subirArchivoNegocio(user.id, file);
      await updateProfile({ avatar_url });
      toast.success("Foto de perfil actualizada");
    } catch {
      toast.error("No se ha podido subir la foto");
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleQuitarFavorito(negocioId: string) {
    if (!user) return;
    try {
      await quitarFavorito(user.id, negocioId);
      await queryClient.invalidateQueries({ queryKey: ["mis-favoritos", user.id] });
      await queryClient.invalidateQueries({ queryKey: ["favorito", negocioId, user.id] });
    } catch {
      toast.error("No se ha podido quitar el favorito");
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 overflow-hidden rounded-2xl border border-border bg-card shadow-lift duration-700">
      <div className="flex flex-wrap items-start justify-between gap-4 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="group relative shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.nombre}
                width={72}
                height={72}
                className="size-[72px] rounded-full object-cover ring-4 ring-background"
              />
            ) : (
              <div className="flex size-[72px] items-center justify-center rounded-full bg-secondary ring-4 ring-background">
                <UserRound className="size-7 text-muted-foreground" />
              </div>
            )}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              aria-label="Cambiar foto de perfil"
              className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-card bg-accent text-accent-foreground shadow-soft transition-transform hover:scale-105 disabled:opacity-60"
            >
              <Camera className="size-3" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void handleAvatarChange(e)}
            />
          </div>

          <div className="min-w-0">
            {editingNombre ? (
              <input
                ref={nombreInputRef}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                onBlur={() => void guardarNombre()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    nombreInputRef.current?.blur();
                  }
                  if (e.key === "Escape") {
                    setNombre(profile.nombre);
                    setEditingNombre(false);
                  }
                }}
                autoFocus
                disabled={savingNombre}
                className="min-w-0 max-w-full border-b-2 border-forest bg-transparent font-serif text-xl font-semibold leading-tight text-foreground outline-none disabled:opacity-60"
                style={{ width: `${Math.max(nombre.length, 3)}ch` }}
              />
            ) : (
              <h1
                onClick={() => setEditingNombre(true)}
                className="group/name inline-flex max-w-full cursor-pointer items-center gap-2 font-serif text-xl font-semibold leading-tight text-foreground transition-opacity hover:opacity-80"
              >
                <span className="truncate">{profile.nombre}</span>
                <Pencil className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/name:opacity-100" />
              </h1>
            )}
            <dl className="mt-1.5 space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {profile.municipio && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 shrink-0" />
                  {profile.municipio}
                </div>
              )}
            </dl>
          </div>
        </div>

        <button
          onClick={() => setTab("configuracion")}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
        >
          <Pencil className="size-3.5" />
          Editar perfil
        </button>
      </div>

      <div className="flex gap-6 border-b border-border px-6 sm:px-8">
        {(
          [
            { id: "favoritos", label: "Mis favoritos" },
            { id: "actividad", label: "Actividad" },
            { id: "configuracion", label: "Configuración" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "border-forest text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        {tab === "favoritos" &&
          (favoritos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {favoritos.map((f) => (
                <div
                  key={f.id}
                  className="group relative overflow-hidden rounded-xl border border-border"
                >
                  <Link to="/negocio/$id" params={{ id: f.negocio.id }} className="block">
                    <div className="relative aspect-square w-full overflow-hidden bg-secondary">
                      {f.negocio.imagen && (
                        <img
                          src={f.negocio.imagen}
                          alt={f.negocio.nombre}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="truncate text-sm font-semibold">{f.negocio.nombre}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {f.negocio.categoria}
                      </p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleQuitarFavorito(f.negocio.id)}
                    aria-label="Quitar de favoritos"
                    className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-[oklch(0.14_0.02_60/0.55)] text-white backdrop-blur-sm transition-opacity hover:bg-[oklch(0.14_0.02_60/0.75)]"
                  >
                    <Heart className="size-3.5 fill-terracotta text-terracotta" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EstadoVacio
              icono={<Heart className="size-6 text-forest" />}
              titulo="Todavía no tienes favoritos"
              texto="Guarda los negocios que te gusten desde su ficha para encontrarlos aquí."
            />
          ))}

        {tab === "actividad" &&
          (favoritos.length > 0 ? (
            <ul className="divide-y divide-border">
              {favoritos.map((f) => (
                <li key={f.id} className="flex items-center gap-3 py-3 text-sm">
                  <Heart className="size-4 shrink-0 text-terracotta" />
                  <span className="min-w-0 flex-1 truncate">
                    Guardaste{" "}
                    <Link
                      to="/negocio/$id"
                      params={{ id: f.negocio.id }}
                      className="font-semibold hover:opacity-70"
                    >
                      {f.negocio.nombre}
                    </Link>{" "}
                    como favorito
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {fechaRelativa(f.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EstadoVacio
              icono={<Clock className="size-6 text-forest" />}
              titulo="Sin actividad todavía"
              texto="Aquí verás lo que vayas guardando en el Valle."
            />
          ))}

        {tab === "configuracion" && (
          <div className="max-w-sm space-y-6">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Municipio</label>
              <Select
                value={profile.municipio ?? ""}
                onValueChange={(v) => void updateProfile({ municipio: v })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Elige tu municipio" />
                </SelectTrigger>
                <SelectContent>
                  {MUNICIPIOS_DISPONIBLES.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Toca tu nombre en la cabecera para cambiarlo. El email viene de tu cuenta de Google y
              no se puede editar aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————————
// Perfil de empresa
// ————————————————————————————————————————————————————————————————

type TabEmpresa = "informacion" | "fotos" | "estadisticas";

function PerfilEmpresa({ userId }: { userId: string }) {
  const [tab, setTab] = useState<TabEmpresa>("informacion");
  const lightbox = useLightbox();

  const { data: negocio, isPending } = useQuery({
    queryKey: ["mi-negocio", userId],
    queryFn: () => fetchMiNegocio(userId),
  });

  const { data: favoritosRecibidos = 0 } = useQuery({
    queryKey: ["favoritos-negocio", negocio?.id],
    queryFn: () => contarFavoritosDeNegocio(negocio!.id),
    enabled: Boolean(negocio),
  });

  if (isPending) {
    return (
      <div className="h-64 animate-pulse rounded-2xl border border-border bg-card shadow-lift" />
    );
  }

  if (!negocio) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 overflow-hidden rounded-2xl border border-border bg-card shadow-lift duration-700">
        <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary">
            <Store className="size-6 text-forest" />
          </div>
          <div className="max-w-sm">
            <h1 className="font-serif text-lg font-bold">Todavía no has dado de alta tu negocio</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Crea tu ficha de empresa para aparecer en el listado de negocios y en el mapa del
              Valle.
            </p>
          </div>
          <MiNegocioDialog>
            <button className="mt-1 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
              <PlusCircle className="size-4" />
              Añadir mi negocio
            </button>
          </MiNegocioDialog>
        </div>
      </div>
    );
  }

  const galeria = [negocio.imagen, ...negocio.fotos].filter((u): u is string => Boolean(u));
  const acento = CATEGORIA_ACENTOS[negocio.categoria] ?? "#c1502e";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 overflow-hidden rounded-2xl border border-border bg-card shadow-lift duration-700">
      {!negocio.aprobado && (
        <div className="flex items-center gap-2.5 border-b border-terracotta/30 bg-terracotta/10 px-6 py-3 text-sm font-semibold text-terracotta sm:px-8">
          <Clock className="size-4 shrink-0" />
          Pendiente de validaccion — todavía no aparece como verificado.
        </div>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary ring-4 ring-background">
            {negocio.imagen ? (
              <img src={negocio.imagen} alt={negocio.nombre} className="size-full object-cover" />
            ) : (
              <Store className="size-7 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0">
            <h1 className="truncate font-serif text-xl font-semibold leading-tight">
              {negocio.nombre}
            </h1>
            {negocio.aprobado && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-forest/40 bg-forest/10 px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-widest text-forest">
                <BadgeCheck className="size-3.5" />
                Negocio verificado
              </span>
            )}
            <dl className="mt-1.5 space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Tag className="size-3.5 shrink-0" />
                {negocio.categoria}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" />
                {negocio.direccion
                  ? `${negocio.direccion}, ${negocio.municipio}`
                  : negocio.municipio}
              </div>
            </dl>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <Link
            to="/negocio/$id"
            params={{ id: negocio.id }}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            <ExternalLink className="size-4" />
            Ver ficha pública
          </Link>
          <MiNegocioDialog>
            <button className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
              <Pencil className="size-4" />
              Editar perfil
            </button>
          </MiNegocioDialog>
        </div>
      </div>

      <div className="flex gap-6 border-b border-border px-6 sm:px-8">
        {(
          [
            { id: "informacion", label: "Información" },
            { id: "fotos", label: "Fotos y vídeo" },
            { id: "estadisticas", label: "Estadísticas" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "border-forest text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        {tab === "informacion" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
            <div className="min-w-0 space-y-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Sobre el negocio
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {negocio.descripcion}
                </p>
              </div>

              {negocio.badges.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                    Distintivos
                  </h3>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {negocio.badges.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                      >
                        <Tag className="size-3.5" style={{ color: acento }} />
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {negocio.abierto !== null && (
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                  <span
                    className={`size-1.5 rounded-full ${negocio.abierto ? "bg-leaf" : "bg-earth"}`}
                    aria-hidden="true"
                  />
                  {negocio.abierto ? "Abierto ahora" : "Cerrado"}
                </p>
              )}
            </div>

            <aside className="h-fit space-y-3 rounded-xl border border-border p-4 text-sm">
              {negocio.horario && (
                <div className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{negocio.horario}</span>
                </div>
              )}
              {negocio.telefono && (
                <a
                  href={`tel:${negocio.telefono}`}
                  className="flex items-center gap-2.5 hover:opacity-70"
                >
                  <Phone className="size-4 shrink-0 text-muted-foreground" />
                  {negocio.telefono}
                </a>
              )}
              {negocio.whatsapp && (
                <a
                  href={`https://wa.me/${negocio.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 hover:opacity-70"
                >
                  <MessageCircle className="size-4 shrink-0 text-muted-foreground" />
                  WhatsApp
                </a>
              )}
              {negocio.email && (
                <a
                  href={`mailto:${negocio.email}`}
                  className="flex items-center gap-2.5 hover:opacity-70"
                >
                  <Mail className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{negocio.email}</span>
                </a>
              )}
              {negocio.web && (
                <a
                  href={negocio.web}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 hover:opacity-70"
                >
                  <Globe className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">Sitio web</span>
                </a>
              )}
              {negocio.instagram && (
                <a
                  href={`https://instagram.com/${negocio.instagram.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 hover:opacity-70"
                >
                  <Instagram className="size-4 shrink-0 text-muted-foreground" />
                  {negocio.instagram}
                </a>
              )}
              {negocio.facebook && (
                <span className="flex items-center gap-2.5">
                  <Facebook className="size-4 shrink-0 text-muted-foreground" />
                  {negocio.facebook}
                </span>
              )}
              {!negocio.horario &&
                !negocio.telefono &&
                !negocio.whatsapp &&
                !negocio.email &&
                !negocio.web &&
                !negocio.instagram &&
                !negocio.facebook && (
                  <p className="text-xs text-muted-foreground">
                    Añade tu horario y datos de contacto desde "Editar perfil".
                  </p>
                )}
            </aside>
          </div>
        )}

        {tab === "fotos" && (
          <div>
            {galeria.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {galeria.map((url, i) => (
                  <Ampliable key={url} index={i} onClick={lightbox.open}>
                    <img
                      src={url}
                      alt=""
                      className="aspect-square w-full rounded-lg object-cover transition-opacity hover:opacity-90"
                    />
                  </Ampliable>
                ))}
              </div>
            ) : (
              <EstadoVacio
                icono={<Images className="size-6 text-forest" />}
                titulo="Todavía no has subido fotos"
                texto='Añádelas desde "Editar perfil" para que tu ficha destaque.'
              />
            )}
            {negocio.video_url && (
              <video src={negocio.video_url} controls className="mt-4 w-full rounded-xl" />
            )}
            {negocio.audio_url && (
              <audio src={negocio.audio_url} controls className="mt-4 w-full" />
            )}
          </div>
        )}

        {tab === "estadisticas" && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <TarjetaStat
              label="Favoritos"
              valor={favoritosRecibidos}
              icono={<Heart className="size-4" />}
            />
            <TarjetaStat
              label="Fotos"
              valor={galeria.length}
              icono={<Images className="size-4" />}
            />
            <TarjetaStat
              label="Distintivos"
              valor={negocio.badges.length}
              icono={<Award className="size-4" />}
            />
            <TarjetaStat
              label="Publicado"
              valor={fechaCorta(negocio.created_at)}
              icono={<Clock className="size-4" />}
            />
          </div>
        )}
      </div>

      <Lightbox
        imagenes={galeria}
        alt={negocio.nombre}
        index={lightbox.index}
        onIndexChange={lightbox.open}
      />
    </div>
  );
}

function TarjetaStat({
  label,
  valor,
  icono,
}: {
  label: string;
  valor: string | number;
  icono: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icono}
        {label}
      </div>
      <p className="mt-2 truncate font-serif text-xl font-semibold">{valor}</p>
    </div>
  );
}

function EstadoVacio({
  icono,
  titulo,
  texto,
}: {
  icono: React.ReactNode;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
        {icono}
      </div>
      <div className="max-w-xs">
        <p className="font-semibold">{titulo}</p>
        <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
      </div>
    </div>
  );
}

// Re-exportado por si algún componente externo necesita el tipo (fichas de negocio).
export type { Negocio };
