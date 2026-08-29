import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { fetchMiNegocio } from "@/lib/negocios";
import { MiNegocioDialog } from "./MiNegocioDialog";

// Justo después de registrarse como negocio (RoleGate ya puso role=comercio),
// pide los datos básicos del negocio antes de dejar navegar libremente, en
// vez de esperar a que el usuario lo encuentre por su cuenta en "Mi cuenta".
export function NegocioGate() {
  const { user, profile } = useAuth();

  const { data: negocio, isPending } = useQuery({
    queryKey: ["mi-negocio", user?.id],
    queryFn: () => fetchMiNegocio(user!.id),
    enabled: Boolean(user) && profile?.role === "comercio",
  });

  const open = Boolean(user) && profile?.role === "comercio" && !isPending && !negocio;

  if (!open) return null;

  return <MiNegocioDialog defaultOpen forzado />;
}
