import { useState, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function useLightbox() {
  const [index, setIndex] = useState<number | null>(null);
  return { index, open: setIndex, close: () => setIndex(null) };
}

export function Lightbox({
  imagenes,
  alt,
  index,
  onIndexChange,
}: {
  imagenes: string[];
  alt: string;
  index: number | null;
  onIndexChange: (i: number | null) => void;
}) {
  const total = imagenes.length;

  function anterior() {
    if (index === null) return;
    onIndexChange((index - 1 + total) % total);
  }

  function siguiente() {
    if (index === null) return;
    onIndexChange((index + 1) % total);
  }

  return (
    <DialogPrimitive.Root open={index !== null} onOpenChange={(o) => !o && onIndexChange(null)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") anterior();
            if (e.key === "ArrowRight") siguiente();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:p-10"
        >
          <DialogPrimitive.Title className="sr-only">{alt}</DialogPrimitive.Title>
          {index !== null && (
            <img
              src={imagenes[index]}
              alt={alt}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />
          )}

          <DialogPrimitive.Close
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={anterior}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={siguiente}
                aria-label="Foto siguiente"
                className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-6"
              >
                <ChevronRight className="size-5" />
              </button>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-semibold text-white/70">
                {index !== null ? index + 1 : 0} / {total}
              </p>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function Ampliable({
  index,
  onClick,
  children,
  className = "",
}: {
  index: number;
  onClick: (i: number) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(index)}
      className={`block w-full cursor-zoom-in text-left ${className}`}
    >
      {children}
    </button>
  );
}
