import "@testing-library/jest-dom";

// Proveer valores por defecto mínimos para las variables de entorno
// usadas por `src/env.ts` durante los tests (evita fallos en CI/PRs).
if (!process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL = "http://localhost:3000";
}
if (!process.env.NEXT_PUBLIC_APP_URL) {
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
}
