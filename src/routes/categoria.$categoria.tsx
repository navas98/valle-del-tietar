import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { fetchNegocios } from "@/lib/negocios";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { NegocioCard } from "@/components/site/NegocioCard";
import comer from "@/assets/cat-comer.jpg";
import dormir from "@/assets/cat-dormir.jpg";
import hacer from "@/assets/cat-hacer.jpg";
import comercio from "@/assets/cat-comercio.jpg";
import naturaleza from "@/assets/cat-naturaleza.jpg";
import pueblos from "@/assets/cat-pueblos.jpg";

const categoriaImages: Record<string, string> = {
  Pueblos: pueblos,
  Naturaleza: naturaleza,
  Comer: comer,
  Dormir: dormir,
  "Qué hacer": hacer,
  "Comercio local": comercio,
};

const categoriaDescripciones: Record<string, string> = {
  Pueblos: "Cada pueblo del Valle guarda su propio carácter, su gente y su historia.",
  Naturaleza: "Bosques, miradores y rincones donde el Valle respira al ritmo de las estaciones.",
  Comer: "Cocina tradicional y de siempre, hecha por quienes conocen el Valle.",
  Dormir: "Casas y alojamientos rurales para descansar rodeado de naturaleza.",
  "Qué hacer": "Planes y actividades para vivir el Valle en cualquier época del año.",
  "Comercio local": "Tiendas y comercios que mantienen viva la vida cotidiana del Valle.",
};

// Un acento distinto por categoría, siempre dentro de la paleta del sitio.
const categoriaAcentos: Record<string, string> = {
  Pueblos: "#c1502e", // terracotta
  Naturaleza: "#4c6a3f", // leaf
  Comer: "#c1502e", // terracotta
  Dormir: "#b9902e", // wood
  "Qué hacer": "#4c6a3f", // leaf
  "Comercio local": "#b9902e", // wood
};

export const Route = createFileRoute("/categoria/$categoria")({
  head: ({ params }) => ({
    meta: [{ title: `${params.categoria} — Salvar el valle` }],
  }),
  component: CategoriaPage,
});

function CategoriaPage() {
  const { categoria } = Route.useParams();

  const { data, isPending, isError } = useQuery({
    queryKey: ["negocios"],
    queryFn: fetchNegocios,
  });

  const negocios = (data ?? []).filter((n) => n.categoria === categoria);
  const bgImage = categoriaImages[categoria];
  const descripcion = categoriaDescripciones[categoria];
  const acento = categoriaAcentos[categoria] ?? "#c1502e";

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen">
        {bgImage && (
          <img src={bgImage} alt="" className="fixed inset-0 -z-10 size-full object-cover" />
        )}
        <div className="fixed inset-0 -z-10 bg-[oklch(0.14_0.02_60/0.45)]" />

        <div className="container-page relative pt-24 sm:pt-28">
          <Link
            to="/"
            hash="descubre"
            className="mx-auto flex max-w-5xl items-center gap-2 text-sm font-semibold text-primary-foreground/90 transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="size-4" />
            Volver a explorar el Valle
          </Link>
        </div>

        <div className="container-page pb-24 pt-10 sm:pt-16">
          <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-2 overflow-hidden rounded-2xl border border-border bg-card shadow-lift duration-700">
            <div className="p-6 sm:p-8">
              <span
                className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]"
                style={{
                  color: acento,
                  borderColor: `${acento}55`,
                  backgroundColor: `${acento}14`,
                }}
              >
                {categoria}
              </span>
              <h1 className="mt-5 font-serif text-4xl italic leading-[1.05] sm:text-5xl">
                {categoria}
              </h1>
              {descripcion && (
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                  {descripcion}
                </p>
              )}
              {!isPending && (
                <div className="mt-5 flex items-center gap-6 border-t border-border pt-4">
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-serif text-xl font-semibold">{negocios.length}</span>
                    <span className="text-xs text-muted-foreground">
                      {negocios.length === 1 ? "negocio" : "negocios"}
                    </span>
                  </span>
                  {negocios.length > 0 && (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-leaf" aria-hidden="true" />
                      {negocios.filter((n) => n.abierto).length} abiertos ahora
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-border p-6 sm:p-8">
              {isError && (
                <p className="text-sm text-muted-foreground">
                  No se han podido cargar los negocios.
                </p>
              )}

              {isPending && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-96 animate-pulse rounded-2xl bg-secondary/60" />
                  ))}
                </div>
              )}

              {!isPending && !isError && negocios.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Todavía no hay negocios registrados en "{categoria}". ¡Vuelve pronto!
                </p>
              )}

              {!isPending && !isError && negocios.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {negocios.map((n, i) => (
                    <NegocioCard key={n.id} n={n} delay={i * 60} accent={acento} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
