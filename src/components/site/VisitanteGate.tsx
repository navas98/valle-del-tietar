import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { CATEGORIAS_NEGOCIO, MUNICIPIOS_DISPONIBLES } from "@/lib/negocios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Justo después de registrarse como visitante (RoleGate ya puso
// role=cliente), pide unos datos básicos antes de dejar navegar
// libremente. fecha_nacimiento hace de marca de "ya completó el alta".
export function VisitanteGate() {
  const { profile, updateProfile } = useAuth();
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [puebloInteres, setPuebloInteres] = useState("");
  const [interesPrincipal, setInteresPrincipal] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setNombre(profile.nombre);
  }, [profile]);

  const open = profile?.role === "cliente" && !profile.fecha_nacimiento;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        nombre,
        fecha_nacimiento: fechaNacimiento,
        pueblo_interes: puebloInteres,
        interes_principal: interesPrincipal,
      });
    } catch {
      toast.error("No se han podido guardar tus datos");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        hideClose
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Cuéntanos un poco sobre ti</DialogTitle>
          <DialogDescription>
            Con esto podemos ayudarte a descubrir mejor el Valle.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre-visitante">Nombre</Label>
            <Input
              id="nombre-visitante"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fecha-nacimiento">Fecha de nacimiento</Label>
            <Input
              id="fecha-nacimiento"
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Pueblo que más te interesa</Label>
            <Select value={puebloInteres} onValueChange={setPuebloInteres} required>
              <SelectTrigger>
                <SelectValue placeholder="Elige un pueblo" />
              </SelectTrigger>
              <SelectContent>
                {MUNICIPIOS_DISPONIBLES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Qué te interesa más</Label>
            <Select value={interesPrincipal} onValueChange={setInteresPrincipal} required>
              <SelectTrigger>
                <SelectValue placeholder="Elige una opción" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS_NEGOCIO.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Continuar"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
