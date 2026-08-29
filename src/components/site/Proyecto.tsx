import fuego from "@/assets/fuego.mp4";
import { Reveal } from "./Reveal";

const stats: [string, string][] = [
  ["+120", "negocios locales"],
  ["24", "pueblos del Valle"],
  ["100%", "de lo que gastas se queda aquí"],
];

export function Proyecto() {
  return (
    <section
      id="proyecto"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-bark py-24 text-primary-foreground sm:py-32"
    >
      <video
        className="absolute inset-0 size-full object-cover"
        src={fuego}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-bark/80" />

      <div className="container-page relative max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow text-terracotta">Por qué esto importa</p>
          <h2 className="mt-6 font-serif text-4xl italic leading-[1.12] sm:text-6xl">
            El verano termina.
            <br />
            El Valle sigue aquí.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-primary-foreground/70">
            El fuego pasó en agosto. La factura llega todo el año siguiente: menos reservas,
            menos mesas llenas, menos motivos para volver. Comer, dormir y comprar aquí no es
            turismo — es la forma más directa de que estos nueve pueblos sigan de pie.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <dl className="mx-auto mt-12 flex max-w-lg flex-wrap justify-center gap-x-12 gap-y-6 border-t border-primary-foreground/15 pt-8">
            {stats.map(([n, t]) => (
              <div key={t}>
                <dt className="font-serif text-3xl font-semibold text-primary-foreground">{n}</dt>
                <dd className="mt-1 text-sm text-primary-foreground/60">{t}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
