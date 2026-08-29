import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { TerminosContenido } from "@/components/site/terminos-contenido";

const title = "Términos y Condiciones — Salvar el valle";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: "Términos y Condiciones de Uso de Salvar Valle del Tiétar." },
    ],
  }),
  component: Terminos,
});

function Terminos() {
  return (
    <>
      <Navbar />
      <main className="bg-background pb-20 pt-28">
        <div className="container-page max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Volver al inicio
          </Link>
          <div className="mt-8">
            <TerminosContenido />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
