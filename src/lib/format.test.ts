import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fechaCorta, fechaRelativa } from "./format";

describe("fechaCorta", () => {
  it("formatea la fecha en español (día, mes en letra, año)", () => {
    expect(fechaCorta("2026-03-05T00:00:00.000Z")).toBe("5 de marzo de 2026");
  });
});

describe("fechaRelativa", () => {
  const ahora = new Date("2026-06-15T12:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(ahora);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('devuelve "Hoy" para una fecha de hoy', () => {
    expect(fechaRelativa(ahora.toISOString())).toBe("Hoy");
  });

  it('devuelve "Ayer" para una fecha de ayer', () => {
    const ayer = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
    expect(fechaRelativa(ayer.toISOString())).toBe("Ayer");
  });

  it('devuelve "Hace N días" para fechas de hace menos de un mes', () => {
    const hace5Dias = new Date(ahora.getTime() - 5 * 86_400_000);
    expect(fechaRelativa(hace5Dias.toISOString())).toBe("Hace 5 días");
  });

  it("cae de vuelta a la fecha completa a partir de 30 días", () => {
    const hace40Dias = new Date(ahora.getTime() - 40 * 86_400_000);
    expect(fechaRelativa(hace40Dias.toISOString())).toBe(fechaCorta(hace40Dias.toISOString()));
  });
});
