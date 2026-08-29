import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import type { Negocio } from "@/lib/negocios";

// Los assets del icono por defecto de Leaflet no se resuelven bien con bundlers
// modernos; se sustituyen explícitamente por las mismas imágenes.
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: shadow,
});

const CENTRO_VALLE: [number, number] = [40.3216, -4.5757];

export default function MapaLeaflet({ negocios }: { negocios: Negocio[] }) {
  return (
    <MapContainer
      center={CENTRO_VALLE}
      zoom={12}
      scrollWheelZoom={false}
      className="h-[26rem] w-full rounded-2xl sm:h-[34rem]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {negocios.map(
        (n) =>
          n.lat != null &&
          n.lng != null && (
            <Marker key={n.id} position={[n.lat, n.lng]}>
              <Popup>
                <div className="flex items-center gap-3">
                  {n.imagen && (
                    <img
                      src={n.imagen}
                      alt={n.nombre}
                      className="size-12 shrink-0 rounded-md object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {n.categoria}
                    </p>
                    <p className="truncate font-bold">{n.nombre}</p>
                    <p className="text-sm text-muted-foreground">{n.municipio}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ),
      )}
    </MapContainer>
  );
}
