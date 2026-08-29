import { lazy, Suspense } from "react";
import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  Facebook,
  Globe,
  Heart,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Tag,
} from "lucide-react";
import { esFavorito, fetchNegocioPorId, marcarFavorito, quitarFavorito } from "@/lib/negocios";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Ampliable, Lightbox, useLightbox } from "@/components/site/Lightbox";

const MapaLeaflet = lazy(() => import("@/components/site/MapaLeaflet"));

export const Route = createFileRoute("/negocio/$id")({
  component: NegocioPage,
});

function NegocioPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: negocio,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["negocio", id],
    queryFn: () => fetchNegocioPorId(id),
  });

  const { data: favorito } = useQuery({
    queryKey: ["favorito", id, user?.id],
    queryFn: () => esFavorito(user!.id, id),
    enabled: Boolean(user),
  });

  async function toggleFavorito() {
    if (!user) {
      toast.error("Inicia sesión para guardar favoritos");
      return;
    }
    try {
      if (favorito) {
        await quitarFavorito(user.id, id);
      } else {
        await marcarFavorito(user.id, id);
      }
      await queryClient.invalidateQueries({ queryKey: ["favorito", id, user.id] });
      await queryClient.invalidateQueries({ queryKey: ["mis-favoritos", user.id] });
    } catch {
      toast.error("No se ha podido actualizar tu favorito");
    }
  }

  const lightbox = useLightbox();
  const galeria = negocio
    ? [negocio.imagen, ...negocio.fotos].filter((u): u is string => Boolean(u))
    : [];

  const tieneContacto =
    negocio &&
    (negocio.horario ||
      negocio.telefono ||
      negocio.whatsapp ||
      negocio.email ||
      negocio.web ||
      negocio.instagram ||
      negocio.facebook);

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen">
        {negocio?.imagen && (
          <img src={negocio.imagen} alt="" className="fixed inset-0 -z-10 size-full object-cover" />
        )}
        <div className="fixed inset-0 -z-10 bg-[oklch(0.14_0.02_60/0.45)]" />

        <div className="container-page relative pt-24 sm:pt-28">
          <Link
            to="/"
            className="mx-auto flex max-w-3xl items-center gap-2 text-sm font-semibold text-primary-foreground/90 transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        </div>

        <div className="container-page pb-24 pt-10 sm:pt-16">
          <div className="mx-auto max-w-3xl">
            {isPending && (
              <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
                <div className="h-72 w-full bg-secondary/60 sm:h-96" />
                <div className="space-y-3 p-6 sm:p-8">
                  <div className="h-4 w-1/3 rounded bg-secondary/60" />
                  <div className="h-8 w-2/3 rounded bg-secondary/60" />
                </div>
              </div>
            )}

            {isError && (
              <div className="rounded-2xl border border-border bg-card p-8 shadow-lift">
                <p className="text-sm text-muted-foreground">
                  No se ha podido cargar este negocio.
                </p>
              </div>
            )}

            {!isPending && !isError && !negocio && (
              <div className="rounded-2xl border border-border bg-card p-8 shadow-lift">
                <p className="text-sm text-muted-foreground">
                  No hemos encontrado este negocio. Puede que ya no esté disponible.
                </p>
              </div>
            )}

            {negocio && (
              <div className="animate-in fade-in slide-in-from-bottom-2 overflow-hidden rounded-2xl border border-border bg-card shadow-lift duration-700">
                {negocio.imagen && (
                  <Ampliable index={0} onClick={lightbox.open}>
                    <img
                      src={negocio.imagen}
                      alt={negocio.nombre}
                      width={1200}
                      height={800}
                      className="h-72 w-full object-cover transition-opacity hover:opacity-90 sm:h-96"
                    />
                  </Ampliable>
                )}

                {negocio.video_url && <video src={negocio.video_url} controls className="w-full" />}

                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <p className="eyebrow text-terracotta">
                      {negocio.categoria} · {negocio.municipio}
                    </p>
                    <button
                      type="button"
                      onClick={() => void toggleFavorito()}
                      aria-pressed={Boolean(favorito)}
                      aria-label={favorito ? "Quitar de favoritos" : "Guardar como favorito"}
                      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
                    >
                      <Heart
                        className={`size-4 ${favorito ? "fill-terracotta text-terracotta" : ""}`}
                      />
                      {favorito ? "En favoritos" : "Guardar"}
                    </button>
                  </div>

                  <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.05] sm:text-4xl">
                    {negocio.nombre}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {negocio.aprobado && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-forest/40 bg-forest/10 px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-widest text-forest">
                        <BadgeCheck className="size-3.5" />
                        Verificado
                      </span>
                    )}
                    {negocio.badges.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                      >
                        <Tag className="size-3.5 text-terracotta" />
                        {b}
                      </span>
                    ))}
                    {negocio.abierto !== null && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <span
                          className={`size-1.5 rounded-full ${negocio.abierto ? "bg-leaf" : "bg-earth"}`}
                          aria-hidden="true"
                        />
                        {negocio.abierto ? "Abierto ahora" : "Cerrado"}
                      </span>
                    )}
                  </div>

                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                    {negocio.descripcion}
                  </p>

                  {negocio.audio_url && (
                    <audio src={negocio.audio_url} controls className="mt-6 w-full" />
                  )}
                </div>

                {negocio.fotos.length > 0 && (
                  <div className="border-t border-border p-6 sm:p-8">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      Fotos
                    </h2>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {negocio.fotos.map((url, i) => (
                        <Ampliable
                          key={url}
                          index={negocio.imagen ? i + 1 : i}
                          onClick={lightbox.open}
                        >
                          <img
                            src={url}
                            alt={negocio.nombre}
                            width={600}
                            height={450}
                            loading="lazy"
                            className="aspect-[4/3] w-full rounded-xl object-cover transition-opacity hover:opacity-90"
                          />
                        </Ampliable>
                      ))}
                    </div>
                  </div>
                )}

                {tieneContacto && (
                  <div className="border-t border-border p-6 sm:p-8">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      Contacto
                    </h2>
                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
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
                          Sitio web
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
                    </div>
                  </div>
                )}

                {(negocio.direccion || (negocio.lat != null && negocio.lng != null)) && (
                  <div className="border-t border-border p-6 sm:p-8">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      Dónde está
                    </h2>
                    {negocio.direccion && (
                      <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-forest" />
                        {negocio.direccion}
                      </p>
                    )}
                    {negocio.lat != null && negocio.lng != null && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-border">
                        <ClientOnly
                          fallback={
                            <div className="flex h-72 items-center justify-center bg-secondary/60">
                              <p className="text-sm text-muted-foreground">Cargando mapa…</p>
                            </div>
                          }
                        >
                          <Suspense
                            fallback={
                              <div className="flex h-72 items-center justify-center bg-secondary/60">
                                <p className="text-sm text-muted-foreground">Cargando mapa…</p>
                              </div>
                            }
                          >
                            <MapaLeaflet negocios={[negocio]} />
                          </Suspense>
                        </ClientOnly>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {negocio && (
        <Lightbox
          imagenes={galeria}
          alt={negocio.nombre}
          index={lightbox.index}
          onIndexChange={lightbox.open}
        />
      )}

      <Footer />
    </>
  );
}
