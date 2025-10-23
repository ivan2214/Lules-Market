import type { Image } from "@/app/generated/prisma";

export function mainImage(images: Image[]) {
  const mainImageFound = images.find((image) => image.isMainImage);
  return mainImageFound?.url;
}
