import type { Image } from "@/db/types";

export function mainImage(images?: Image[]): string {
  const mainImageFound = images?.find((image) => image.isMainImage);
  return mainImageFound?.url || "https://placehold.co/600x400";
}
