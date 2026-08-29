import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  CATEGORIAS_NEGOCIO,
  MUNICIPIOS_DISPONIBLES,
  fetchMiNegocio,
  guardarMiNegocio,
  subirArchivoNegocio,
} from "@/lib/negocios";
import { loadGoogleMaps } from "@/lib/google-maps";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Ubicacion = { direccion: string; lat: number; lng: number };

export function MiNegocioDialog({
  children,
  defaultOpen = false,
  forzado = false,
}: {
  children?: ReactNode;
  defaultOpen?: boolean;
  forzado?: boolean;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(defaultOpen);
  const [saving, setSaving] = useState(false);

  const { data: negocio } = useQuery({
    queryKey: ["mi-negocio", user?.id],
    queryFn: () => fetchMiNegocio(user!.id),
    enabled: Boolean(user) && open,
  });

  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState<string>("");
  const [municipio, setMunicipio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [abierto, setAbierto] = useState(true);
  const [imagen, setImagen] = useState<string | null>(null);
  const [fotos, setFotos] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [horario, setHorario] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [web, setWeb] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [uploadingPortada, setUploadingPortada] = useState(false);
  const [uploadingFotos, setUploadingFotos] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const uploading = uploadingPortada || uploadingFotos || uploadingVideo || uploadingAudio;

  const direccionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!negocio) return;
    setNombre(negocio.nombre);
    setCategoria(negocio.categoria);
    setMunicipio(negocio.municipio);
    setDescripcion(negocio.descripcion);
    setAbierto(negocio.abierto ?? true);
    setImagen(negocio.imagen);
    setFotos(negocio.fotos);
    setVideoUrl(negocio.video_url);
    setAudioUrl(negocio.audio_url);
    setHorario(negocio.horario ?? "");
    setTelefono(negocio.telefono ?? "");
    setEmail(negocio.email ?? "");
    setWeb(negocio.web ?? "");
    setInstagram(negocio.instagram ?? "");
    setFacebook(negocio.facebook ?? "");
    setWhatsapp(negocio.whatsapp ?? "");
    if (negocio.lat != null && negocio.lng != null) {
      const u = { direccion: negocio.direccion ?? "", lat: negocio.lat, lng: negocio.lng };
      setUbicacion(u);
      if (direccionInputRef.current) direccionInputRef.current.value = u.direccion;
    }
  }, [negocio]);

  // Autocompletado de Google Places sobre el input de dirección.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    loadGoogleMaps()
      .then(() => {
        if (cancelled || !direccionInputRef.current) return;

        const autocomplete = new google.maps.places.Autocomplete(direccionInputRef.current, {
          fields: ["formatted_address", "geometry", "address_components"],
          componentRestrictions: { country: "es" },
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const loc = place.geometry?.location;
          if (!loc) {
            toast.error("Elige una dirección de la lista de sugerencias");
            return;
          }
          setUbicacion({
            direccion: place.formatted_address ?? "",
            lat: loc.lat(),
            lng: loc.lng(),
          });
        });
      })
      .catch(() => {
        // Sin VITE_GOOGLE_MAPS_API_KEY configurada, el campo de dirección
        // sigue funcionando como texto libre, solo sin autocompletado.
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handlePortada(file: File) {
    if (!user) return;
    setUploadingPortada(true);
    try {
      setImagen(await subirArchivoNegocio(user.id, file));
    } catch {
      toast.error("No se ha podido subir la foto");
    } finally {
      setUploadingPortada(false);
    }
  }

  async function handleFotosExtra(files: FileList) {
    if (!user) return;
    setUploadingFotos(true);
    try {
      const nuevas = await Promise.all(
        Array.from(files).map((file) => subirArchivoNegocio(user.id, file)),
      );
      setFotos((prev) => [...prev, ...nuevas]);
    } catch {
      toast.error("No se han podido subir algunas fotos");
    } finally {
      setUploadingFotos(false);
    }
  }

  function quitarFoto(url: string) {
    setFotos((prev) => prev.filter((f) => f !== url));
  }

  async function handleVideo(file: File) {
    if (!user) return;
    setUploadingVideo(true);
    try {
      setVideoUrl(await subirArchivoNegocio(user.id, file));
    } catch {
      toast.error("No se ha podido subir el vídeo");
    } finally {
      setUploadingVideo(false);
    }
  }

  async function handleAudio(file: File) {
    if (!user) return;
    setUploadingAudio(true);
    try {
      setAudioUrl(await subirArchivoNegocio(user.id, file));
    } catch {
      toast.error("No se ha podido subir el audio");
    } finally {
      setUploadingAudio(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !categoria) return;
    setSaving(true);
    try {
      await guardarMiNegocio({
        id: negocio?.id,
        owner_id: user.id,
        nombre,
        categoria: categoria as (typeof CATEGORIAS_NEGOCIO)[number],
        municipio,
        descripcion,
        imagen,
        fotos,
        video_url: videoUrl,
        audio_url: audioUrl,
        abierto,
        direccion: ubicacion?.direccion ?? direccionInputRef.current?.value ?? null,
        lat: ubicacion?.lat ?? null,
        lng: ubicacion?.lng ?? null,
        horario: horario || null,
        telefono: telefono || null,
        email: email || null,
        web: web || null,
        instagram: instagram || null,
        facebook: facebook || null,
        whatsapp: whatsapp || null,
      });
      await queryClient.invalidateQueries({ queryKey: ["mi-negocio", user.id] });
      await queryClient.invalidateQueries({ queryKey: ["negocios"] });
      toast.success("Ficha del negocio guardada");
      setOpen(false);
    } catch {
      toast.error("No se ha podido guardar el negocio");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent
        className="max-h-[85vh] overflow-y-auto sm:max-w-lg"
        hideClose={forzado}
        {...(forzado
          ? {
              onInteractOutside: (e) => e.preventDefault(),
              onEscapeKeyDown: (e) => e.preventDefault(),
            }
          : {})}
      >
        <DialogHeader>
          <DialogTitle>{forzado ? "Cuéntanos sobre tu negocio" : "Mi negocio"}</DialogTitle>
          <DialogDescription>
            {forzado
              ? "Para terminar de registrarte como negocio, danos estos datos básicos. Podrás completarlos con fotos y más detalles después."
              : "Esta información aparecerá en el listado de negocios y en el mapa del Valle."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="foto">Foto de portada</Label>
            {imagen && (
              <img
                src={imagen}
                alt="Foto de portada"
                className="h-40 w-full rounded-lg object-cover"
              />
            )}
            <Input
              id="foto"
              type="file"
              accept="image/*"
              disabled={uploadingPortada}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handlePortada(file);
              }}
            />
            {uploadingPortada && <p className="text-xs text-muted-foreground">Subiendo foto…</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fotos-extra">Más fotos</Label>
            {fotos.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {fotos.map((url) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-lg"
                  >
                    <img src={url} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => quitarFoto(url)}
                      aria-label="Quitar foto"
                      className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Input
              id="fotos-extra"
              type="file"
              accept="image/*"
              multiple
              disabled={uploadingFotos}
              onChange={(e) => {
                if (e.target.files?.length) void handleFotosExtra(e.target.files);
                e.target.value = "";
              }}
            />
            {uploadingFotos && <p className="text-xs text-muted-foreground">Subiendo fotos…</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="video">Vídeo (opcional)</Label>
            {videoUrl && <video src={videoUrl} controls className="w-full rounded-lg" />}
            <div className="flex gap-2">
              <Input
                id="video"
                type="file"
                accept="video/*"
                disabled={uploadingVideo}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleVideo(file);
                }}
              />
              {videoUrl && (
                <button
                  type="button"
                  onClick={() => setVideoUrl(null)}
                  className="shrink-0 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary"
                >
                  Quitar
                </button>
              )}
            </div>
            {uploadingVideo && <p className="text-xs text-muted-foreground">Subiendo vídeo…</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="audio">Audio (opcional)</Label>
            {audioUrl && <audio src={audioUrl} controls className="w-full" />}
            <div className="flex gap-2">
              <Input
                id="audio"
                type="file"
                accept="audio/*"
                disabled={uploadingAudio}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleAudio(file);
                }}
              />
              {audioUrl && (
                <button
                  type="button"
                  onClick={() => setAudioUrl(null)}
                  className="shrink-0 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary"
                >
                  Quitar
                </button>
              )}
            </div>
            {uploadingAudio && <p className="text-xs text-muted-foreground">Subiendo audio…</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre del local</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Categoría</Label>
            <Select value={categoria} onValueChange={setCategoria} required>
              <SelectTrigger>
                <SelectValue placeholder="Elige una categoría" />
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

          <div className="grid gap-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              ref={direccionInputRef}
              placeholder="Empieza a escribir la calle…"
              defaultValue={ubicacion?.direccion}
            />
            {ubicacion && (
              <p className="flex items-start gap-2 rounded-lg bg-secondary/60 p-2 text-xs text-muted-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-forest" />
                {ubicacion.direccion}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Municipio</Label>
            <Select value={municipio} onValueChange={setMunicipio} required>
              <SelectTrigger>
                <SelectValue placeholder="Elige un municipio" />
              </SelectTrigger>
              <SelectContent>
                {MUNICIPIOS_DISPONIBLES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              De momento solo se pueden dar de alta negocios de estos dos municipios.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <Label htmlFor="abierto" className="cursor-pointer">
              Abierto ahora
            </Label>
            <Switch id="abierto" checked={abierto} onCheckedChange={setAbierto} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="horario">Horario</Label>
            <Input
              id="horario"
              placeholder="Lunes - Domingo, 09:00 - 21:00"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email-negocio">Email de contacto</Label>
            <Input
              id="email-negocio"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="web">Sitio web</Label>
            <Input
              id="web"
              placeholder="https://…"
              value={web}
              onChange={(e) => setWeb(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                placeholder="@usuario"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                placeholder="Nombre de la página"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="mt-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar negocio"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
