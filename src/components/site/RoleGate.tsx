import { useAuth } from "@/lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function RoleGate() {
  const { user, profile, setRole } = useAuth();

  const open = Boolean(user) && profile !== null && profile.role === null;

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideClose
      >
        <DialogHeader>
          <DialogTitle>¿Cómo quieres usar Salvar el valle?</DialogTitle>
          <DialogDescription>
            Elige un perfil para continuar. Podrás cambiarlo más adelante desde tu cuenta.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setRole("cliente")}
            className="rounded-xl border border-border p-5 text-left transition-colors hover:border-forest hover:bg-secondary/50"
          >
            <span className="block text-lg font-bold">Soy visitante</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Quiero descubrir negocios, pueblos e historias del Valle.
            </span>
          </button>
          <button
            onClick={() => setRole("comercio")}
            className="rounded-xl border border-border p-5 text-left transition-colors hover:border-forest hover:bg-secondary/50"
          >
            <span className="block text-lg font-bold">Soy un negocio</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Quiero dar de alta mi negocio y que me encuentren.
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
