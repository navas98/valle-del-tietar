import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pause, Play } from "lucide-react";
import { fetchHistorias, type Historia } from "@/lib/historias";
import { shuffle } from "@/lib/utils";
import { Reveal } from "./Reveal";

function PlayButton({
  size,
  playing,
  tieneAudio,
}: {
  size: "lg" | "sm";
  playing: boolean;
  tieneAudio: boolean;
}) {
  const dim = size === "lg" ? "size-16" : "size-10";
  const icon = size === "lg" ? "size-6" : "size-4";
  return (
    <span
      className={`flex ${dim} items-center justify-center rounded-full backdrop-blur-sm transition-colors duration-200 ${
        tieneAudio
          ? "bg-primary-foreground/15 group-hover:bg-accent"
          : "bg-primary-foreground/10 opacity-60"
      }`}
    >
      {playing ? (
        <Pause className={`${icon} fill-current`} />
      ) : (
        <Play className={`${icon} translate-x-[1px] fill-current`} />
      )}
    </span>
  );
}

function HistoriaFeatured({
  h,
  playing,
  onToggle,
}: {
  h: Historia;
  playing: boolean;
  onToggle: () => void;
}) {
  const tieneAudio = Boolean(h.audio_url);
  return (
    <button
      onClick={tieneAudio ? onToggle : undefined}
      aria-disabled={!tieneAudio}
      className={`group relative block h-64 w-full overflow-hidden text-left sm:h-96 lg:h-full ${
        tieneAudio ? "" : "cursor-default"
      }`}
    >
      <img
        src={h.imagen ?? undefined}
        alt={`${h.persona}, ${h.negocio}`}
        width={960}
        height={1200}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
      <span className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.14_0.02_60/0.92)_0%,oklch(0.14_0.02_60/0.08)_45%,oklch(0.14_0.02_60/0.35)_100%)]" />

      <span className="absolute inset-0 flex items-center justify-center">
        <PlayButton size="lg" playing={playing} tieneAudio={tieneAudio} />
      </span>
      {!tieneAudio && (
        <span className="absolute left-6 top-6 rounded-md bg-primary-foreground/10 px-2 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
          Audio próximamente
        </span>
      )}

      <span className="absolute inset-x-6 bottom-7 sm:inset-x-10 sm:bottom-10">
        <span className="block font-serif text-2xl italic leading-[1.18] text-primary-foreground sm:text-4xl">
          “{h.titulo}”
        </span>
        <span className="mt-4 block text-sm text-primary-foreground/65">
          <span className="font-semibold text-primary-foreground/90">{h.persona}</span> —{" "}
          {h.negocio}, {h.municipio}
        </span>
      </span>
    </button>
  );
}

function HistoriaSecundaria({
  h,
  playing,
  onToggle,
}: {
  h: Historia;
  playing: boolean;
  onToggle: () => void;
}) {
  const tieneAudio = Boolean(h.audio_url);
  return (
    <button
      onClick={tieneAudio ? onToggle : undefined}
      aria-disabled={!tieneAudio}
      className={`group flex w-full items-center gap-4 rounded-xl p-2 text-left transition-colors hover:bg-primary-foreground/5 ${
        tieneAudio ? "" : "cursor-default"
      }`}
    >
      <span className="relative block size-[68px] shrink-0 overflow-hidden rounded-lg">
        <img
          src={h.imagen ?? undefined}
          alt={`${h.persona}, ${h.negocio}`}
          width={160}
          height={160}
          loading="lazy"
          className="size-full object-cover"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-serif text-[0.95rem] font-semibold italic text-primary-foreground/90">
          “{h.titulo}”
        </span>
        <span className="mt-1 block text-xs text-primary-foreground/50">
          {h.persona} · {h.negocio}
        </span>
      </span>
      <PlayButton size="sm" playing={playing} tieneAudio={tieneAudio} />
    </button>
  );
}

export function Historias() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["historias"],
    queryFn: fetchHistorias,
  });

  const destacadas = useMemo(() => shuffle(data ?? []).slice(0, 3), [data]);
  const [featured, ...secundarias] = destacadas;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  function toggle(h: Historia) {
    const audio = audioRef.current;
    if (!audio || !h.audio_url) return;

    if (playingId === h.id) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    audio.src = h.audio_url;
    audio.play();
    setPlayingId(h.id);
  }

  return (
    <section
      id="historias"
      className="relative flex min-h-screen flex-col overflow-hidden bg-bark text-primary-foreground sm:h-screen lg:flex-row"
    >
      {isError && (
        <p className="container-page py-20 text-sm text-primary-foreground/60">
          No se han podido cargar las historias. Inténtalo de nuevo más tarde.
        </p>
      )}

      {isPending && (
        <div className="container-page w-full py-20">
          <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-primary-foreground/10" />
        </div>
      )}

      {!isPending && !isError && featured && (
        <>
          <Reveal className="min-w-0 lg:h-full lg:flex-1">
            <HistoriaFeatured
              h={featured}
              playing={playingId === featured.id}
              onToggle={() => toggle(featured)}
            />
          </Reveal>

          <Reveal
            delay={100}
            className="flex flex-col justify-center bg-[#1a1712] px-6 py-12 sm:px-10 sm:py-14 lg:h-full lg:w-[38%] lg:shrink-0 lg:px-12"
          >
            <p className="eyebrow text-terracotta">Historias del Valle</p>
            <h2 className="mt-3 max-w-sm text-3xl font-semibold leading-[1.08] sm:text-4xl">
              Las personas detrás de cada negocio
            </h2>
            <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-primary-foreground/55">
              Cómo vivieron el incendio, y cómo están volviendo a levantarlo, contado por ellos
              mismos.
            </p>

            {secundarias.length > 0 && (
              <div className="mt-9 flex flex-col gap-1 border-t border-primary-foreground/10 pt-3">
                {secundarias.map((h) => (
                  <HistoriaSecundaria
                    key={h.id}
                    h={h}
                    playing={playingId === h.id}
                    onToggle={() => toggle(h)}
                  />
                ))}
              </div>
            )}
          </Reveal>
        </>
      )}

      <audio ref={audioRef} onEnded={() => setPlayingId(null)} className="hidden" />
    </section>
  );
}
