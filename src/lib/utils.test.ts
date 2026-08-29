import { describe, expect, it } from "vitest";
import { cn, shuffle } from "./utils";

describe("cn", () => {
  it("une clases simples", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignora valores falsy", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("resuelve conflictos de Tailwind quedándose con la última clase", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("shuffle", () => {
  it("no muta el array original", () => {
    const original = [1, 2, 3, 4, 5];
    const copia = [...original];
    shuffle(original);
    expect(original).toEqual(copia);
  });

  it("conserva todos los elementos (mismo multiconjunto)", () => {
    const original = [1, 2, 3, 4, 5];
    const resultado = shuffle(original);
    expect(resultado).toHaveLength(original.length);
    expect([...resultado].sort()).toEqual([...original].sort());
  });

  it("devuelve un array vacío si se le pasa uno vacío", () => {
    expect(shuffle([])).toEqual([]);
  });
});
