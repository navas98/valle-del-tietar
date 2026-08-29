import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import comer from "@/assets/cat-comer.jpg";
import dormir from "@/assets/cat-dormir.jpg";
import hacer from "@/assets/cat-hacer.jpg";
import comercio from "@/assets/cat-comercio.jpg";
import naturaleza from "@/assets/cat-naturaleza.jpg";
import pueblos from "@/assets/cat-pueblos.jpg";
import mapa from "@/assets/mapa.jpg";
import { Reveal } from "./Reveal";

const categorias = [
  { name: "Pueblos", img: pueblos, big: true, accent: "#c1502e" },
  { name: "Naturaleza", img: naturaleza, accent: "#4c6a3f" },
  { name: "Comer", img: comer, accent: "#c1502e" },
  { name: "Dormir", img: dormir, accent: "#b9902e" },
  { name: "Qué hacer", img: hacer, accent: "#4c6a3f" },
  { name: "Comercio local", img: comercio, accent: "#b9902e" },
];

export function Explora() {
  return (
    <section
      id="descubre"
      className="relative flex flex-col justify-center overflow-hidden py-20 text-primary-foreground sm:py-24"
    >
      <img
        src={mapa}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-[oklch(0.14_0.02_60/0.88)]" />

      <div className="container-page relative">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-terracotta">Descubre</p>
              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.03] sm:text-5xl">
                ¿Qué quieres descubrir?
              </h2>
            </div>
          </div>
        </Reveal>

        <Reveal delay={70}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categorias.map((c) => (
              <Link
                key={c.name}
                {...(c.name === "Pueblos"
                  ? { to: "/", hash: "pueblos" }
                  : { to: "/categoria/$categoria", params: { categoria: c.name } })}
                className="group relative block aspect-square overflow-hidden rounded-xl sm:aspect-[4/3]"
              >
                <img
                  src={c.img}
                  alt={c.name}
                  width={900}
                  height={1200}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.14_0.02_60/0.85),transparent_50%)]" />
                <span
                  className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest backdrop-blur-sm sm:left-5 sm:top-5"
                  style={{
                    color: c.accent,
                    borderColor: `${c.accent}80`,
                    backgroundColor: "oklch(0.14 0.02 60 / 0.55)",
                  }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: c.accent }}
                    aria-hidden="true"
                  />
                  {c.name}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4 sm:p-5">
                  <span
                    className={`font-serif font-semibold text-primary-foreground ${
                      c.big ? "text-2xl sm:text-3xl" : "text-lg"
                    }`}
                  >
                    {c.name}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 translate-y-1 text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
