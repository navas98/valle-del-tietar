import "@testing-library/jest-dom/vitest";

// jsdom no implementa IntersectionObserver; lo usan los componentes con
// animación de aparición (Reveal) al hacer scroll.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error -- stub mínimo, no la interfaz completa del navegador.
globalThis.IntersectionObserver = IntersectionObserverStub;
