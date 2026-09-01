import { describe, expect, it } from "vitest";

import { normalizarUrlExterna } from "./url";

describe("normalizarUrlExterna", () => {
  it("acepta http y https tal cual", () => {
    expect(normalizarUrlExterna("https://ejemplo.es")).toBe("https://ejemplo.es/");
    expect(normalizarUrlExterna("http://ejemplo.es/ruta")).toBe("http://ejemplo.es/ruta");
  });

  it("asume https cuando no hay esquema", () => {
    expect(normalizarUrlExterna("ejemplo.es")).toBe("https://ejemplo.es/");
    expect(normalizarUrlExterna("  ejemplo.es/tienda  ")).toBe("https://ejemplo.es/tienda");
  });

  it("rechaza esquemas peligrosos", () => {
    expect(normalizarUrlExterna("javascript:alert(1)")).toBeNull();
    expect(normalizarUrlExterna("data:text/html,<script>1</script>")).toBeNull();
    expect(normalizarUrlExterna("vbscript:msgbox(1)")).toBeNull();
  });

  it("devuelve null para vacío o inválido", () => {
    expect(normalizarUrlExterna(null)).toBeNull();
    expect(normalizarUrlExterna("")).toBeNull();
    expect(normalizarUrlExterna("   ")).toBeNull();
    expect(normalizarUrlExterna("http://")).toBeNull();
  });
});
