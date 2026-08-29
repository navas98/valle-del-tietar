import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import apicultor from "@/assets/hist-2.jpg";
import { useAuth } from "@/lib/auth";
import { Reveal } from "./Reveal";

const acciones = [
  { n: "01", t: "Ven", d: "Visita el Valle." },
  { n: "02", t: "Descubre", d: "Conoce lugares nuevos." },
  { n: "03", t: "Consume local", d: "Compra, come y duerme en negocios de la zona." },
  {
    n: "04",
    t: "Comparte",
    d: "Ayuda a que otras personas descubran que el Valle sigue vivo.",
  },
];

const beneficios = [
  "Aparece en el listado y en el mapa",
  "Cuenta tu historia a tu manera",
  "Sin cuotas ni permanencia",
];

function NegocioCta() {
  const { user, requestSignIn } = useAuth();

  return (
    <div className="relative flex h-full flex-col justify-center overflow-hidden bg-[linear-gradient(135deg,#d97042_0%,#c1502e_55%,#9c3f22_100%)] px-8 py-16 text-accent-foreground sm:px-12 lg:py-0">
      <span className="w-fit rounded-full border border-accent-foreground/35 bg-ink/15 px-3 py-1 text-xs font-bold uppercase tracking-widest">
        Para negocios
      </span>
      <h3 className="mt-5 max-w-xs font-serif text-3xl font-semibold leading-[1.1] sm:text-4xl">
        ¿Tienes un negocio en el Valle?
      </h3>
      <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-accent-foreground/90">
        Súmate gratis y llega a quienes buscan dónde comer, dormir o comprar en la zona.
      </p>

      <ul className="mt-7 flex flex-col gap-3">
        {beneficios.map((b) => (
          <li key={b} className="flex items-center gap-3 text-sm font-semibold">
            <Check className="size-[18px] shrink-0" strokeWidth={2.75} />
            {b}
          </li>
        ))}
      </ul>

      {user ? (
        <Link
          to="/cuenta"
          className="mt-9 w-fit rounded-lg bg-ink px-7 py-4 text-sm font-bold text-accent-foreground shadow-lift transition-colors hover:bg-ink/90"
        >
          Da de alta tu negocio
        </Link>
      ) : (
        <button
          onClick={() => requestSignIn("register")}
          className="mt-9 w-fit rounded-lg bg-ink px-7 py-4 text-sm font-bold text-accent-foreground shadow-lift transition-colors hover:bg-ink/90"
        >
          Da de alta tu negocio
        </button>
      )}

      
    </div>
  );
}

export function Ayudar() {
  return (
    <section
      id="ayudar"
      className="relative flex min-h-screen flex-col overflow-hidden text-primary-foreground sm:h-screen lg:flex-row"
    >
      <div className="relative flex flex-1 flex-col justify-center overflow-hidden py-24 sm:py-28 lg:py-0">
        <img
          src={apicultor}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.14_0.02_60/0.92),oklch(0.14_0.02_60/0.7))]" />

        <div className="container-page relative lg:mx-0 lg:max-w-xl lg:px-0 lg:pl-16">
          <Reveal>
            <p className="eyebrow text-terracotta">Cómo puedes ayudar</p>
            <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.03] sm:text-5xl">
              Ayudar es más fácil de lo que parece.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {acciones.map((a, i) => (
              <Reveal key={a.t} delay={i * 70}>
                <div className="border-t border-primary-foreground/20 pt-6">
                  <span className="text-sm font-bold text-terracotta">{a.n}</span>
                  <h3 className="mt-4 text-2xl font-semibold">{a.t}</h3>
                  <p className="mt-2 text-base leading-relaxed text-primary-foreground/70">{a.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Reveal delay={80} className="lg:w-[38%] lg:shrink-0">
        <NegocioCta />
      </Reveal>
    </section>
  );
}
