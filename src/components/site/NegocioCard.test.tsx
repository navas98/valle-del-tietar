import type React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Negocio } from "@/lib/negocios";
import { NegocioCard } from "./NegocioCard";

// Sin RouterProvider en el test, así que Link se sustituye por un <a> simple.
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
    params?: Record<string, string>;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={`${to}/${params?.["id"] ?? ""}`} {...props}>
      {children}
    </a>
  ),
}));

function crearNegocio(overrides: Partial<Negocio> = {}): Negocio {
  return {
    id: "1",
    nombre: "Mesón La Adrada",
    categoria: "Comer",
    municipio: "Sotillo de la Adrada",
    descripcion: "Cocina castellana de siempre.",
    imagen: null,
    abierto: true,
    badges: [],
    direccion: null,
    lat: null,
    lng: null,
    owner_id: null,
    fotos: [],
    video_url: null,
    audio_url: null,
    telefono: null,
    email: null,
    web: null,
    instagram: null,
    facebook: null,
    whatsapp: null,
    horario: null,
    aprobado: true,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

describe("NegocioCard", () => {
  it("muestra el nombre, la categoría y el municipio", () => {
    render(<NegocioCard n={crearNegocio()} />);
    expect(screen.getByText("Mesón La Adrada")).toBeInTheDocument();
    expect(screen.getByText("Comer · Sotillo de la Adrada")).toBeInTheDocument();
  });

  it('muestra "Abierto ahora" cuando abierto es true', () => {
    render(<NegocioCard n={crearNegocio({ abierto: true })} />);
    expect(screen.getByText("Abierto ahora")).toBeInTheDocument();
  });

  it('muestra "Cerrado" cuando abierto es false', () => {
    render(<NegocioCard n={crearNegocio({ abierto: false })} />);
    expect(screen.getByText("Cerrado")).toBeInTheDocument();
  });

  it("no muestra el estado de apertura cuando abierto es null", () => {
    render(<NegocioCard n={crearNegocio({ abierto: null })} />);
    expect(screen.queryByText("Abierto ahora")).not.toBeInTheDocument();
    expect(screen.queryByText("Cerrado")).not.toBeInTheDocument();
  });

  it('muestra el badge "Verificado" solo si el negocio está aprobado', () => {
    const { rerender } = render(<NegocioCard n={crearNegocio({ aprobado: true })} />);
    expect(screen.getByText("Verificado")).toBeInTheDocument();

    rerender(<NegocioCard n={crearNegocio({ aprobado: false })} />);
    expect(screen.queryByText("Verificado")).not.toBeInTheDocument();
  });

  it("enlaza a la ficha del negocio correcto", () => {
    render(<NegocioCard n={crearNegocio({ id: "abc-123" })} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/negocio/$id/abc-123");
  });
});
