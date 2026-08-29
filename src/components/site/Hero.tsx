import heroPoster from "@/assets/hero-valle.jpg";
import heroVideo from "@/assets/hero-valle.mp4.asset.json";

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-end overflow-hidden">
      <video
        className="absolute inset-0 size-full object-cover"
        src={heroVideo.url}
        poster={heroPoster}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.19_0.012_120/0.82),oklch(0.19_0.012_120/0.35)_55%,oklch(0.19_0.012_120/0.45))]" />

      <div className="container-page relative z-10 pb-24 pt-32 sm:pb-28">
        <p className="eyebrow text-primary-foreground/80">Valle del Tiétar · Ávila</p>
        <h1 className="mt-5 max-w-5xl text-6xl font-semibold leading-[0.92] text-primary-foreground sm:text-8xl lg:text-[9rem]">
          Salvar el valle.
        </h1>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-primary-foreground/85 sm:text-xl">
          Pueblos, bosques y negocios de siempre. Visítalos, consume local, y ayuda a que el
          Valle siga en pie.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-6">
          <a
            href="#descubre"
            className="rounded-lg bg-accent px-7 py-3.5 text-sm font-bold text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
          >
            Explorar el Valle
          </a>
          <a
            href="#ayudar"
            className="text-sm font-semibold text-primary-foreground/90 underline decoration-primary-foreground/40 underline-offset-4 transition-colors hover:decoration-primary-foreground"
          >
            Cómo ayudar
          </a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-primary-foreground/45 p-1">
          <span className="h-2 w-0.5 animate-bounce rounded-full bg-primary-foreground/80" />
        </span>
      </div>
    </section>
  );
}
