let loadPromise: Promise<void> | null = null;

/** Carga el script de Google Maps JS (con la librería Places) una sola vez. */
export function loadGoogleMaps(): Promise<void> {
  if (loadPromise) return loadPromise;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return Promise.reject(new Error("Falta VITE_GOOGLE_MAPS_API_KEY"));

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=es&region=ES`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se ha podido cargar Google Maps"));
    document.head.appendChild(script);
  });

  return loadPromise;
}
