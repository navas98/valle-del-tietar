import { describe, expect, it, vi } from "vitest";

vi.mock("./supabase", () => ({
  supabase: {},
}));

import { MUNICIPIOS_DISPONIBLES } from "./negocios";

describe("MUNICIPIOS_DISPONIBLES", () => {
  it("incluye los tres pueblos de la primera fase", () => {
    expect(MUNICIPIOS_DISPONIBLES).toEqual(["Sotillo de la Adrada", "La Adrada", "Piedralaves"]);
  });
});
