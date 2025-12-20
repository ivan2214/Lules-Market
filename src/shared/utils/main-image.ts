import type { Image } from "@/db/types";

export function mainImage({
  images,
  image,
}: {
  images?: Image[] | null;
  image?: Image | null;
}): string {
  const isArray = Array.isArray(images);

  if (isArray) {
    const mainImageFound = images?.find((image) => image.isMainImage);
    return mainImageFound?.url || "https://placehold.co/600x400";
  }

  const imageToReturn = image || images?.[0];
  return imageToReturn?.url || "https://placehold.co/600x400";
}
