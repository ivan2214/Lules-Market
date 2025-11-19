export function generatedSlug(name: string): string {
  return name
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .toLowerCase()
    .replace(/\s+/g, "-") // espacios por guiones
    .replace(/[^a-z0-9-]/g, ""); // solo letras, números y guiones
}

export function daysFromNow(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
