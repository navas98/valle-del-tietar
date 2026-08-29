import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { useAuth } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TerminosContenido } from "./terminos-contenido";

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.38z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l3.99 3.1C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

// Se muestra antes de lanzar el login con Google: sin marcar la casilla de
// aceptación de los Términos y Condiciones no se puede continuar.
export function TerminosDialog() {
  const { termsIntent, confirmTerms, cancelTerms } = useAuth();
  const [aceptado, setAceptado] = useState(false);

  const open = termsIntent !== null;

  // Cada vez que se abre el diálogo la casilla vuelve a estar sin marcar.
  useEffect(() => {
    if (open) setAceptado(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && cancelTerms()}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Antes de registrarte</DialogTitle>
          <DialogDescription>
            Para continuar tienes que leer y aceptar los Términos y Condiciones de Uso.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="-mx-2 min-h-0 flex-1 rounded-md border border-border px-4 py-3">
          <TerminosContenido />
        </ScrollArea>

        <label className="flex items-start gap-3 text-sm text-foreground">
          <Checkbox
            checked={aceptado}
            onCheckedChange={(v) => setAceptado(v === true)}
            className="mt-0.5"
          />
          <span>
            He leído y acepto los{" "}
            <Link
              to="/terminos"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              className="font-semibold underline underline-offset-2"
            >
              Términos y Condiciones de Uso
            </Link>
            .
          </span>
        </label>

        <DialogFooter>
          <button
            onClick={cancelTerms}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={() => void confirmTerms()}
            disabled={!aceptado}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GoogleIcon />
            Aceptar y continuar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
