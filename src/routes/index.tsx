import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Proyecto } from "@/components/site/Proyecto";
import { Explora } from "@/components/site/Explora";
// Desactivada temporalmente: usa datos de ejemplo desconectados de negocios
// reales. Se retomará más adelante conectándola a contenido real.
// import { Historias } from "@/components/site/Historias";
import { Ayudar } from "@/components/site/Ayudar";
import { Pueblos } from "@/components/site/Pueblos";
import { Footer } from "@/components/site/Footer";

const title = "Salvar el valle — Descubre el Valle del Tiétar";
const description =
  "Negocios, pueblos y experiencias del Valle del Tiétar. Ven, descubre y consume local: el Valle sigue vivo.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Proyecto />
        <Explora />
        {/* <Historias /> */}
        <Pueblos />
        <Ayudar />
      </main>
      <Footer />
    </>
  );
}
